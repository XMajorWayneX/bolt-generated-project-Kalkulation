import React, { useState, useEffect } from 'react';
import ItemSearch from './components/ItemSearch';
import ItemManagement from './components/ItemManagement';
import RegionManagement from './components/RegionManagement';
import LandingPage from './components/LandingPage';
import { db, itemsCollection, regionsCollection, addDoc, setDoc, doc, deleteDoc, onSnapshot, collection, auth, onAuthStateChanged, signOut } from './firebase';

function App() {
  const [activeTab, setActiveTab] = useState('search');
  const [items, setItems] = useState(() => {
    const storedItems = localStorage.getItem('items');
    return storedItems ? JSON.parse(storedItems) : [];
  });
  const [regions, setRegions] = useState(() => {
    const storedRegions = localStorage.getItem('regions');
    return storedRegions ? JSON.parse(storedRegions) : [];
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('regions', JSON.stringify(regions));
  }, [regions]);

  const handleAddItem = async (newItem) => {
    setItems(prevItems => [...prevItems, newItem]);
  };

  const handleUpdateItem = async (updatedItem) => {
    setItems(prevItems =>
      prevItems.map(item => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  const handleDeleteItem = async (itemId) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const handleAddRegion = async (newRegion) => {
    setRegions(prevRegions => [...prevRegions, newRegion]);
  };

  const handleUpdateRegion = async (updatedRegion) => {
    setRegions(prevRegions =>
      prevRegions.map(region => (region.id === updatedRegion.id ? updatedRegion : region))
    );
  };

  const handleDeleteRegion = async (regionId) => {
    setRegions(prevRegions => prevRegions.filter(region => region.id !== regionId));
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out error", error);
    }
  };

  if (!user) {
    return <LandingPage onSignIn={() => {}} />;
  }

  return (
    <div className="container">
      <nav className="nav">
        <button onClick={() => setActiveTab('search')} className={activeTab === 'search' ? 'active' : ''}>Suchen</button>
        <button onClick={() => setActiveTab('manageItems')} className={activeTab === 'manageItems' ? 'active' : ''}>Artikel erstellen</button>
        <button onClick={() => setActiveTab('manageRegions')} className={activeTab === 'manageRegions' ? 'active' : ''}>Gebiete verwalten</button>
        <button onClick={handleSignOut}>Abmelden</button>
      </nav>

      {activeTab === 'search' && <ItemSearch items={items} regions={regions} />}
      {activeTab === 'manageItems' && (
        <ItemManagement
          items={items}
          regions={regions}
          onAddItem={handleAddItem}
          onUpdateItem={handleUpdateItem}
          onDeleteItem={handleDeleteItem}
        />
      )}
      {activeTab === 'manageRegions' && (
        <RegionManagement
          regions={regions}
          onAddRegion={handleAddRegion}
          onUpdateRegion={handleUpdateRegion}
          onDeleteRegion={handleDeleteRegion}
          items={items}
          onUpdateItem={handleUpdateItem}
        />
      )}
    </div>
  );
}

export default App;
