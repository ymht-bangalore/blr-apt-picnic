import {supabase, isSupabaseConfigured} from './supabase';

export interface Mahatma {
    name: string;
    mobile: string;
    ageGroup: 'less-8' | 'more-8' | '';
}

export interface RegistrationResult {
    success: boolean;
    registrationId?: string;
    error?: string;
    people?: Mahatma[];
}

const toTitleCase = (str: string): string => {
    if (!str.trim()) return '';
    return str
        .trim()
        .replace(/\s+/g, ' ')
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

/**
 * Creates an initial pending registration record in Supabase (or LocalStorage).
 * This is called on load of the payment section to reserve the registration.
 */
export async function createPendingRegistration(
    people: Mahatma[],
    amount: number,
    pickupPoint: string
): Promise<RegistrationResult> {
    // Validate input parameters
    if (people.length === 0) {
        return {success: false, error: 'Please enter at least one person.'};
    }
    if (!pickupPoint || !pickupPoint.trim()) {
        return {success: false, error: 'Please select a pickup point.'};
    }

    const processedPeople: Mahatma[] = [];
    for (let i = 0; i < people.length; i++) {
        const person = people[i];
        const cleanName = person.name.trim();
        if (!cleanName) {
            return {success: false, error: 'All names must be filled out.'};
        }
        if (!/^[a-zA-Z\s]+$/.test(cleanName)) {
            return {
                success: false,
                error: `Invalid name "${person.name}". Names must only contain alphabets and spaces.`
            };
        }
        const cleanMobile = person.mobile.trim();
        if (i === 0) {
            if (!/^\d{10}$/.test(cleanMobile)) {
                return {
                    success: false,
                    error: `Invalid mobile number for primary attendee ${person.name}. Must be exactly 10 digits.`
                };
            }
        } else {
            if (cleanMobile && !/^\d{10}$/.test(cleanMobile)) {
                return {
                    success: false,
                    error: `Invalid mobile number for attendee ${person.name}. Must be exactly 10 digits if provided.`
                };
            }
        }

        processedPeople.push({
            name: toTitleCase(cleanName),
            mobile: cleanMobile,
            ageGroup: person.ageGroup || 'more-8'
        });
    }

    // --- Real Supabase Submission ---
    if (!isSupabaseConfigured || !supabase) {
        return {
            success: false,
            error: 'Supabase database is not configured. Please check environment variables.'
        };
    }

    try {
        // Generate registration ID client-side
        const registrationId = typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

        // Insert into registrations table with placeholder for screenshot
        const {error: insertError} = await supabase
            .from('registrations')
            .insert([
                {
                    id: registrationId,
                    people: processedPeople,
                    amount,
                    pickup_point: pickupPoint,
                    screenshot_url: '', // Empty placeholder as per schema requirement
                    status: 'pending'
                }
            ]);

        if (insertError) {
            console.error('Database Insert Error:', insertError);
            return {
                success: false,
                error: `Registration initialization failed: ${insertError.message}`
            };
        }

        return {
            success: true,
            registrationId,
            people: processedPeople
        };

    } catch (e: any) {
        console.error('Unexpected error in registration init:', e);
        return {
            success: false,
            error: e.message || 'An unexpected error occurred during registration initialization.'
        };
    }
}

/**
 * Uploads a payment screenshot to Supabase
 * and links it to the existing registration record by ID.
 */
export async function uploadPaymentScreenshot(
    registrationId: string,
    screenshotFile: File
): Promise<{ success: boolean; error?: string; screenshotUrl?: string }> {
    if (!screenshotFile) {
        return {success: false, error: 'Please upload a payment screenshot.'};
    }

    // --- Real Supabase Submission ---
    if (!isSupabaseConfigured || !supabase) {
        return {
            success: false,
            error: 'Supabase database is not configured. Please check environment variables.'
        };
    }

    try {
        // 1. Upload screenshot file to Supabase storage
        const fileExt = screenshotFile.name.split('.').pop() || 'png';
        const cleanFileName = screenshotFile.name
            .substring(0, screenshotFile.name.lastIndexOf('.'))
            .replace(/[^a-zA-Z0-9]/g, '_');

        const filePath = `${Date.now()}_${Math.random().toString(36).substring(2, 11)}_${cleanFileName}.${fileExt}`;

        const {error: uploadError} = await supabase.storage
            .from('screenshots')
            .upload(filePath, screenshotFile, {
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) {
            console.error('Storage Upload Error:', uploadError);
            return {
                success: false,
                error: `Screenshot upload failed: ${uploadError.message}. Make sure the 'screenshots' bucket exists in Supabase Storage.`
            };
        }

        // 2. Get Public URL of the uploaded screenshot
        const {data: {publicUrl}} = supabase.storage
            .from('screenshots')
            .getPublicUrl(filePath);

        // 3. Update registrations table with publicUrl
        const {error: updateError} = await supabase
            .from('registrations')
            .update({
                screenshot_url: publicUrl
            })
            .eq('id', registrationId);

        if (updateError) {
            console.error('Database Update Error:', updateError);
            return {
                success: false,
                error: `Registration update failed: ${updateError.message}`
            };
        }

        return {
            success: true,
            screenshotUrl: publicUrl
        };

    } catch (e: any) {
        console.error('Unexpected error in screenshot upload:', e);
        return {
            success: false,
            error: e.message || 'An unexpected error occurred during screenshot upload.'
        };
    }
}

/**
 * Deletes a pending registration by ID.
 */
export async function deletePendingRegistration(
    registrationId: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const response = await fetch(`/api/submissions?id=${registrationId}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            return {success: true};
        } else {
            const data = await response.json();
            return {success: false, error: data.error || 'Failed to delete pending registration.'};
        }
    } catch (e: any) {
        return {success: false, error: e.message || 'An unexpected error occurred during deletion.'};
    }
}
