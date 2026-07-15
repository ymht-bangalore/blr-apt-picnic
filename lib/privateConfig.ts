// Private Picnic Configurations
// Contains contact helpline details and payment credentials.
// All values are loaded dynamically from environment variables (.env.local) to keep code private.

const contactsEnv = process.env.NEXT_PUBLIC_CONTACTS || '';

// Parse contact list dynamically from string "Name:Phone,Name:Phone"
const parsedContacts = contactsEnv.trim()
    ? contactsEnv
        .split(',')
        .map(item => {
            const parts = item.split(':');
            return {
                name: parts[0] ? parts[0].trim() : '',
                phone: parts[1] ? parts[1].trim() : ''
            };
        })
        .filter(contact => contact.name && contact.phone)
    : [];

export const privateConfig = {
    // Contact details loaded from env variables (empty by default)
    contacts: parsedContacts,

    // UPI ID where funds will be received (empty by default)
    upiId: process.env.NEXT_PUBLIC_UPI_ID || '',

    // Display name of the receiver in UPI app (empty by default)
    payeeName: process.env.NEXT_PUBLIC_UPI_NAME || ''
};
