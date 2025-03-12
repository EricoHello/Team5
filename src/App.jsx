import React, { useState } from 'react';
import Account from './components/Account';
import Challenge from './components/Challenge'; // Assuming you have a Challenge component
import Discussion from './components/Discussion';
import Home from './components/Home';
import Playground from './components/Playground';
import Projects from './components/Projects';
import TestMe from './components/TestMe';

import './App.css';

function App() {
  const [page, setPage] = useState('home');
  const [showResources, setShowResources] = useState(false);

  const navigateToPage = (pageName) => {
    setPage(pageName);
    setShowResources(false); // Close dropdown when navigating
  };

  return (
    <div>
      <header>
        <div id="mainNav">
          <h1 id="logo">Learn2Code</h1>
          <button onClick={() => navigateToPage('home')}>Home</button>

          {/* Resources Dropdown */}
          <div className="dropdown">
            <button onClick={() => setShowResources(!showResources)}>Resources ▼</button>
            {showResources && (
              <div className="dropdown-content">
                <button onClick={() => navigateToPage('Discussion')}>Discussion</button>
                <button onClick={() => navigateToPage('Projects')}>Projects</button>
                <button onClick={() => navigateToPage('Challenge')}>Challenge of the Day</button>
              </div>
            )}
          </div>
          <button onClick={() => navigateToPage('testme')}>Test Me</button>
          <button onClick={() => navigateToPage('Account')}>Account</button>
          <button onClick={() => navigateToPage('Playground')}>Playground</button>
        </div>
      </header>

      <div id="container">
        <div id="mainContent">
          {page === 'home' && <Home />}
          {page === 'testme' && <TestMe />}
          {page === 'Discussion' && <Discussion />}
          {page === 'Projects' && <Projects />}
          {page === 'Account' && <Account />}
          {page === 'Challenge' && <Challenge />} {/* New Challenge Component */}
          {page === 'Playground' && <Playground />}
        </div>
      </div>

      <footer>
        &copy; 2025 Learn2Code. All rights reserved.
      </footer>
    </div>
  );
}

export default App;