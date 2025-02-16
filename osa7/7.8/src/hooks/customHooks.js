import { useState, useEffect } from 'react'
import axios from 'axios'

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  useEffect(() => {
    axios.get(baseUrl).then(response => {
      setResources(response.data)
    })
  }, [baseUrl])

  const create = async (newResource) => {
    const response = await axios.post(baseUrl, newResource)
    setResources(resources.concat(response.data))
  }

  return [resources, { create }]
}

export default useResource
