import React from 'react'
import { useSearch } from '../../context/search'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const SearchInput = () => {
    const [values, setValues] = useSearch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.get(`/api/v1/product/search/${values.keyword}`);
            setValues({ ...values, results: data })
            navigate('/search');
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div>
            <form className="d-flex" role="search" onSubmit={handleSubmit}>
                <input className="form-control me-2 rounded-pill" style={{ height: "50%", marginTop: "6px", }} type="search" placeholder="Search" aria-label="Search"
                    value={values.keyword} onChange={(e) => setValues({ ...values, keyword: e.target.value })} />
                <button className="btn btn-outline-success rounded-pill" type="submit" style={{ height: "30px", marginTop: "6px", paddingTop: "3px" }}>Search</button>
            </form>

        </div >
    )
}

export default SearchInput

