import { SortDirection } from 'react-virtualized';
export const ordering = (data, sortBy, sortDir) => {
  return data.sort((a, b) => {
    return sortDir === SortDirection.ASC ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy]
  })
}