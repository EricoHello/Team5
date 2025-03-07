import React, { useState } from 'react';
import Home from './components/Home';
import TestMe from './components/TestMe';
import Projects from './components/Projects';
import Discussion from './components/Discussion';
import Account from './components/Account';


import './App.css';


function App() {
  const [page, setPage] = useState('home');

  const navigateToPage = (pageName) => {
    setPage(pageName);
  };


  return (
    <div>
      <header>
        <div id="mainNav">
          <h1 id="logo">Learn2Code</h1>
          <button onClick={() => navigateToPage('home')}>Home</button>
          <button onClick={() => navigateToPage('testme')}>Test Me</button>
          <button onClick={() => navigateToPage('Discussion')}>Discussion</button>
          <button onClick={() => navigateToPage('Projects')}>Projects</button>
          <button onClick={() => navigateToPage('Account')}>Account</button>
        </div>
      </header>


      <div id="container">
        <div id="mainContent">
          {page === 'home' && <Home />}
          {page === 'testme' && <TestMe />}
          {page === 'Discussion' && <Discussion />}
          {page === 'Projects' && <Projects />}
          {page === 'Account' && <Account />}
        </div>
      </div>
      <footer>
        &copy; 2025 Learn2Code. All rights reserved.
      </footer>
    </div>
  );
}


export default App;



