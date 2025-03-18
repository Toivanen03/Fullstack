const cachePolicies = {
    Query: {
      fields: {
        allBooks: {
          merge(existing = [], incoming) {
            return [
              ...existing,
              ...incoming.filter((book) => 
                !existing.some((b) => b.id === book.id))
            ]
          }
        }
      }
    }
  }
  
  export default cachePolicies
  