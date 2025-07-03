import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export interface Subscription {
    userId: string;
    planType: 'Free' | 'Premium' | 'Business';
    paymentStatus: 'pending' | 'verified' | 'failed';
    transactionId?: string;
    validityStart?: Date;
    validityEnd?: Date;
}

export async function getUserSubscription(userId: string): Promise<Subscription | null> {
    try {
        const docRef = doc(db, "subscriptions", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as Subscription;
        } else {
            console.log("No such subscription document!");
            return null;
        }
    } catch (error) {
        console.error("Error getting user subscription:", error);
        return null;
    }
}

export async function getPendingVerifications() {
    try {
        const q = query(collection(db, "subscriptions"), where("paymentStatus", "==", "pending"));
        const querySnapshot = await getDocs(q);
        const verifications: Subscription[] = [];
        querySnapshot.forEach((doc) => {
            verifications.push({ userId: doc.id, ...doc.data() } as Subscription);
        });
        return verifications;
    } catch (error) {
        console.error("Error getting pending verifications:", error);
        return [];
    }
}
