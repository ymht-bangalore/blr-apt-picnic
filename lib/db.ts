import {supabase, isSupabaseConfigured} from './supabase';

export interface Mahatma {
    name: string;
    mobile: string;
    ageGroup: 'less-8' | 'more-8' | '';
}

export interface RegistrationResult {
    success: boolean;
    registrationId?: string;
    isDemo: boolean;
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
 * Registers a list of Mahatmas for the picnic, uploads the payment screenshot,
 * and inserts the registration record into Supabase.
 * Falls back to LocalStorage if Supabase is not configured.
 */
export async function registerMahatmas(
    people: Mahatma[],
    amount: number,
    screenshotFile: File | null
): Promise<RegistrationResult> {
    // Validate input parameters
    if (people.length === 0) {
        return {success: false, isDemo: !isSupabaseConfigured, error: 'Please enter at least one person.'};
    }

    const processedPeople: Mahatma[] = [];
    for (let i = 0; i < people.length; i++) {
        const person = people[i];
        const cleanName = person.name.trim();
        if (!cleanName) {
            return {success: false, isDemo: !isSupabaseConfigured, error: 'All names must be filled out.'};
        }
        if (!/^[a-zA-Z\s]+$/.test(cleanName)) {
            return {
                success: false,
                isDemo: !isSupabaseConfigured,
                error: `Invalid name "${person.name}". Names must only contain alphabets and spaces.`
            };
        }
        const cleanMobile = person.mobile.trim();
        if (i === 0) {
            if (!/^\d{10}$/.test(cleanMobile)) {
                return {
                    success: false,
                    isDemo: !isSupabaseConfigured,
                    error: `Invalid mobile number for primary attendee ${person.name}. Must be exactly 10 digits.`
                };
            }
        } else {
            if (cleanMobile && !/^\d{10}$/.test(cleanMobile)) {
                return {
                    success: false,
                    isDemo: !isSupabaseConfigured,
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

    if (!screenshotFile) {
        return {success: false, isDemo: !isSupabaseConfigured, error: 'Please upload a payment screenshot.'};
    }

    // --- Real Supabase Submission ---
    if (isSupabaseConfigured && supabase) {
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
                    isDemo: false,
                    error: `Screenshot upload failed: ${uploadError.message}. Make sure the 'screenshots' bucket exists in Supabase Storage.`
                };
            }

            // 2. Get Public URL of the uploaded screenshot
            const {data: {publicUrl}} = supabase.storage
                .from('screenshots')
                .getPublicUrl(filePath);

            // Generate registration ID client-side to avoid calling .select('id'),
            // which requires SELECT permission under Row-Level Security (RLS) policies.
            const registrationId = typeof crypto !== 'undefined' && crypto.randomUUID
                ? crypto.randomUUID()
                : `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

            // 3. Insert into registrations table
            const {error: insertError} = await supabase
                .from('registrations')
                .insert([
                    {
                        id: registrationId,
                        people: processedPeople,
                        amount,
                        screenshot_url: publicUrl,
                        status: 'pending'
                    }
                ]);

            if (insertError) {
                console.error('Database Insert Error:', insertError);
                return {
                    success: false,
                    isDemo: false,
                    error: `Registration failed: ${insertError.message}`
                };
            }

            return {
                success: true,
                isDemo: false,
                registrationId,
                people: processedPeople
            };

        } catch (e: any) {
            console.error('Unexpected error in registration:', e);
            return {
                success: false,
                isDemo: false,
                error: e.message || 'An unexpected error occurred during registration.'
            };
        }
    }

    // --- Mock Mode Fallback ---
    // Wait 1.5 seconds to simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
        const mockId = `demo-reg-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
        const mockScreenshotUrl = URL.createObjectURL(screenshotFile);

        // Save to LocalStorage for debugging
        const existing = localStorage.getItem('mock_registrations');
        const list = existing ? JSON.parse(existing) : [];

        const newRecord = {
            id: mockId,
            created_at: new Date().toISOString(),
            people: processedPeople,
            amount,
            screenshot_url: mockScreenshotUrl,
            status: 'pending'
        };

        list.push(newRecord);
        localStorage.setItem('mock_registrations', JSON.stringify(list));

        return {
            success: true,
            isDemo: true,
            registrationId: mockId,
            people: processedPeople
        };
    } catch (e: any) {
        return {
            success: false,
            isDemo: true,
            error: `Demo Registration Error: ${e.message}`
        };
    }
}
