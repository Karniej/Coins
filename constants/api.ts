// eslint-disable-next-line max-len
const API_URL = 'https://api.coinpaprika.com/v1/coins'

export async function fetchData(page = 1) {
  // eslint-disable-next-line max-len
  const response = await fetch(`${API_URL}`)

  const data = await response.json()

  return data
}

export async function fetchSingleItem(id) {
  const response = await fetch(`${API_URL}${id}`)

  const item = await response.json()

  return item
}
export default {
  API_URL,
  fetchData,
}
