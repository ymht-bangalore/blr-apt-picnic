// Public Picnic Configurations
// Editable parameters for event dates, routes, fare, and main text headings.

export interface PickupPointOption {
    id: string;
    name: string;
}

export const publicConfig = {
    title: "Picnic with Aptaputra Bhaio",
    subtitle: "For all mahatmas of Bengaluru",
    badgeText: "Jai Satchitanand",
    picnicDate: "25th July (Saturday)",
    departureTime: "6:30 AM (tentative) from respective pickup points",
    returnTime: "Bus leaves picnic spot by 4:00 PM",
    picnicFare: 700, // Fare amount in ₹ per person
    pickupPoints: [
        {id: 'akshay-nagar', name: 'Akshay Nagar (NRI Layout)'},
        {id: 'hedge-nagar', name: 'Hedge Nagar'},
        {id: 'iskcon', name: 'Iskcon Rajaji Nagar'},
        {id: 'ms-palya', name: 'MS Palya'},
        {id: 'mysore-bank', name: 'Mysore Bank (Majestic)'},
        {id: 'whitefield', name: 'Whitefield'},
        {id: 'self', name: 'Self'},
    ] as PickupPointOption[]
};
