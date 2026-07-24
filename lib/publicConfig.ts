// Public Picnic Configurations
// Editable parameters for event dates, routes, fare, and main text headings.

export interface PickupPointOption {
    id: string;
    name: string;
    isFull?: boolean; // Optional: set true for a specific point to close only that individual pickup point
}

export const publicConfig = {
    title: "Picnic with Aptaputra Bhaio",
    subtitle: "For all mahatmas of Bengaluru",
    badgeText: "Jai Satchitanand",
    picnicDate: "25th July (Saturday)",
    departureTime: "6:30 AM (tentative) from respective pickup points",
    returnTime: "Bus leaves picnic spot by 4:00 PM",
    picnicFare: 700, // Fare amount in ₹ per person

    // TOGGLE SWITCH FOR ALL REGISTRATIONS:
    // Set to `true` to close all registrations completely & display "Registrations Closed" notice.
    // Set to `false` to open registrations.
    registrationClosed: false,

    closedNotice: {
        badge: "Registrations Closed",
        title: "Picnic Registrations Are Now Closed",
        message: "Jai Satchitanand! Registrations for the Bengaluru Picnic with Aptaputra Bhaio are now officially closed. Thank you to all mahatmas for your overwhelming response!",
        subMessage: "If you have already registered and are not yet added to the WhatsApp group, please contact 9008374455 (Bhavesh Patel)."
    },

    // TOGGLE SWITCH FOR BUS REGISTRATIONS:
    // Set to `true` to close all bus pickup points & display "All Buses Full" notice.
    // Set to `false` to open bus pickup registrations again.
    busRegistrationClosed: true,

    busNotice: {
        badge: "Bus Registrations Full",
        title: "All Buses Are Full – Self Transportation Only",
        message: "Jai Satchitanand! All bus pickup points are now fully booked, and we are no longer taking bus registrations. If you would like to join the picnic with Aptaputra Bhaio, please plan your transportation independently.",
        subMessage: "You can still complete your picnic registration below by selecting 'Self' as your travel option."
    },

    pickupPoints: [
        {
            id: 'akshay-nagar',
            name: 'Akshay Nagar (NRI Layout)',
            isFull: false
        },
        {
            id: 'hedge-nagar',
            name: 'Hedge Nagar',
            isFull: false
        },
        {
            id: 'iskcon',
            name: 'Iskcon Rajaji Nagar',
            isFull: false
        },
        {
            id: 'ms-palya',
            name: 'MS Palya',
            isFull: false
        },
        {
            id: 'mysore-bank',
            name: 'Mysore Bank (Majestic)',
            isFull: false
        },
        {
            id: 'whitefield',
            name: 'Whitefield',
            isFull: false
        },
        {
            id: 'self',
            name: 'Self',
            isFull: false
        },
    ] as PickupPointOption[]
};
