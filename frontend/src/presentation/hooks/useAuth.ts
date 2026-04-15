import { Role } from '@/src/domain/entity/role.enum';
import { User as UserEntity } from '@/src/domain/entity/user.entity';
import { AppProviders } from '@/src/provider/provider';
import { app } from '@/src/shared/firebase.config';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { useEffect, useState } from 'react';

export function useAuth() {
  const [fbUser, setFbUser] = useState<User | null>(null);
  const [currUser, setCurrUser] = useState<UserEntity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(app);

    // 1. Listen for Firebase Auth changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFbUser(firebaseUser);

      if (firebaseUser?.email) {
        try {
          // 2. Fetch the full UserEntity from your database
          const userData = await AppProviders.GetUserByEmailUseCase.execute(firebaseUser.email);
          setCurrUser(userData);
        } catch (error) {
          console.log("Failed to fetch UserEntity:", error);
          try {
            await AppProviders.CreateUserUseCase.execute(
              {
                email: firebaseUser.email || '',
                password: 'managed-via-firebase',
                username: firebaseUser.displayName || 'temp ' + Date.now(),
                role: Role.CUSTOMER
              }
            );
          } catch (error) {
            console.log('User exists or error creating, attempting update...', error);
          }
        }
      } else {
        setCurrUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    fbUser,     // The raw Firebase Auth object
    currUser,   // Your custom UserEntity from the DB
    loading,
    isAuthenticated: !!fbUser
  };
}