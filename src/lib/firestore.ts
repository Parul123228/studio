// All Firestore-related functions have been removed to simplify the app
// and resolve configuration errors.
// You can add your Firestore logic back here when you have configured Firebase.

export interface Subscription {
    userId: string;
    planType: 'Free' | 'Premium' | 'Business';
    paymentStatus: 'pending' | 'verified' | 'failed';
    transactionId?: string;
    validityStart?: Date;
    validityEnd?: Date;
}
