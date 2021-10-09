import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router';

const Search = ({history}) => {
  const [keyword, setKeyword] = useState('');
  const [searchWord, setSearchWord] = useState('');
  const [checkWord, setCheckWord] = useState('');
  const searchHandler = (e) => {
    e.preventDefault();
    if (searchWord.trim()){
       history.push(`/search/${searchWord}`);
       setCheckWord(searchWord)
       setSearchWord('');
    }
    else 
    <Redirect push to='/'/>  
}

  useEffect(()=>{
    window.onpopstate=()=>{
      setKeyword('');
      setCheckWord('');
      <Redirect push to='/'/>
    }
    if(!keyword && history.location.pathname.split('/')[1]==='search'){
      if(!checkWord){
        setKeyword(history.location.pathname.split('/')[2]);
      }
    }
  },[history, searchWord, keyword, checkWord])
  return (
    <form onSubmit={(e) => searchHandler(e)}>
      <div className="input-group">
        <input
          type="text"
          id="search_field"
          autoComplete="off"
          className="form-control"
          placeholder="Search a product..."
          value={history.location.pathname.split('/')[1]==='search'?keyword:searchWord}
          onChange={(e) =>{ 
            setSearchWord(e.target.value);
            setKeyword(e.target.value);}}
        />
        <div className="input-group-append">
          <button id="search_btn" className="btn">
            <i className="fa fa-search" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </form>
  );
};

export default Search;
