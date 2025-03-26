export interface Note {
    id: string,
    content: string
  }
  
export type NewNote = Omit<Note, 'id'>