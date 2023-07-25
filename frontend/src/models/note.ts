export interface Note {
    _id: string, // Mongodb uses underscore to automatically assign the id
    title: string,
    text?: string,
    createdAt: string, // createdAt is how mongoDB uses timestamps.
    updatedAt: string, // mongoDB "edited at"
}

// Everything is a string because we receieve json from the backend, and Json doesn't have very elaborate data types. 