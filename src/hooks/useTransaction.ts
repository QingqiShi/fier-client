import { useCallback } from 'react';
import { firestore } from 'firebase/app';
import user from 'stores/user';

function useTransaction() {
  const [{ uid }] = user.useStore();
  return useCallback(
    ({
      fromAccountId,
      toAccountId,
      categoryId,
      dateTime,
      value,
      notes,
    }: Omit<Data.Transaction, 'id'>) => {
      const db = firestore();
      const fromAccountDocRef =
        fromAccountId !== null
          ? db.doc(`users/${uid}/accounts/${fromAccountId}`)
          : null;
      const toAccountDocRef =
        toAccountId !== null
          ? db.doc(`users/${uid}/accounts/${toAccountId}`)
          : null;
      const transactionsCollectionRef = db.collection(
        `users/${uid}/transactions`
      );

      return db.runTransaction(async (transaction) => {
        const fromAccountDoc = fromAccountDocRef
          ? await transaction.get(fromAccountDocRef)
          : null;
        const toAccountDoc = toAccountDocRef
          ? await transaction.get(toAccountDocRef)
          : null;

        // Update from account balance
        if (fromAccountDoc && fromAccountDocRef) {
          transaction.set(
            fromAccountDocRef,
            { balance: (fromAccountDoc.data()?.balance ?? 0) - value },
            { merge: true }
          );
        }

        // Update to account balance
        if (toAccountDoc && toAccountDocRef) {
          transaction.set(
            toAccountDocRef,
            { balance: (toAccountDoc.data()?.balance ?? 0) + value },
            { merge: true }
          );
        }

        // Save transaction
        transaction.set(transactionsCollectionRef.doc(), {
          value,
          dateTime: dateTime?.unix(),
          fromAccountId,
          toAccountId,
          categoryId,
          notes,
        });
      });
    },
    [uid]
  );
}

export default useTransaction;
