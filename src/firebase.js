import { initializeApp } from "firebase/app"
import { getDatabase, ref, onValue, set } from "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyAxrjqHbJ-gvWre-a9gg3WGdQaRF3W34o0",
  authDomain: "shazplan.firebaseapp.com",
  databaseURL: "https://shazplan-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "shazplan"
}

const app = initializeApp(firebaseConfig)

export const db = getDatabase(app)
export const dbRef = ref(db, "store")

export { onValue, set }