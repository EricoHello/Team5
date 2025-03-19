import React, { useState } from 'react';
import Account from './components/Account';
import Challenge from './components/Challenge'; 
import Discussion from './components/Discussion';
import Home from './components/Home';
import Playground from './components/Playground';
import Projects from './components/Projects';
import TestMe from './components/TestMe';

import './App.css';

/**
 * This is the main component of the application. It manages the navigation between different pages
 * and renders the appropriate component based on the user's selection. The component also manages the 
 * dropdown menu for resources.
 */
function App() {
  const [page, setPage] = useState('home');
  const [showResources, setShowResources] = useState(false);

  const navigateToPage = (pageName) => {
    setPage(pageName);
    setShowResources(false); 
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
          <button onClick={() => navigateToPage('Playground')}>Playground</button>
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
          {page === 'Challenge' && <Challenge />} 
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