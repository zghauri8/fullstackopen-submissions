import { useDispatch } from 'react-redux'
import { setFilter } from '../reducers/filterSlice'

const Filter = () => {
  const dispatch = useDispatch()
  const handleChange = (e) => dispatch(setFilter(e.target.value))
  return (
    <div style={{ marginBottom: 10 }}>
      filter <input onChange={handleChange} />
    </div>
  )
}
export default Filter