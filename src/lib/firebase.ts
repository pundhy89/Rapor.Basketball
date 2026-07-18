import { initializeApp } from 'firebase/app';
import { getFirestore, doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { useStore } from '../store';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Sync Zustand with Firestore
export const initFirebaseSync = () => {
  const store = useStore.getState();
  const docRef = doc(db, 'academy_data', 'main');

  let isHydrating = true;
  let isUpdatingFromFirebase = false;

  // 1. Initial Load & Listen for changes from Firebase
  const unsubscribe = onSnapshot(docRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data();
      isUpdatingFromFirebase = true;
      // We need to carefully merge or set all data
      store.setAllData(data as any);
      setTimeout(() => { isUpdatingFromFirebase = false; }, 100);
    } else {
      // Document doesn't exist, push initial state
      debouncedSync(useStore.getState());
    }
    isHydrating = false;
  });

  // 2. Listen to local Zustand changes and push to Firebase
  useStore.subscribe((state, prevState) => {
    if (isHydrating || isUpdatingFromFirebase) return;
    
    // We only push if something actually changed (Zustand subscribe runs on any change)
    // To prevent infinite loops and massive writes, we can debounce this
    debouncedSync(state);
  });

  return unsubscribe;
};

let timeoutId: any = null;
const debouncedSync = (state: any) => {
  if (timeoutId) clearTimeout(timeoutId);
  timeoutId = setTimeout(async () => {
    try {
      const docRef = doc(db, 'academy_data', 'main');
      // We remove the BGM list base64 audio to avoid 1MB limit issues
      const cleanState: any = {};
      for (const key in state) {
        if (typeof state[key] !== 'function') {
          cleanState[key] = state[key];
        }
      }
      const stateToSave = { ...cleanState, settings: { ...cleanState.settings } };
      delete stateToSave.settings.bgmList;
      await setDoc(docRef, stateToSave);
      console.log('Synced to Firebase');
    } catch (e) {
      console.error('Failed to sync to Firebase:', e);
    }
  }, 2000);
};
