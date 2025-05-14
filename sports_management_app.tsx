import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown, Menu, User, Users, Award, Bell, Clock, List, Settings, Home, Activity, Brain, CheckCircle, AlertTriangle } from 'lucide-react';
import _ from 'lodash';
import * as tf from 'tensorflow';

// Sample data
const initialTeams = [
  { id: 1, name: "Lions FC", sport: "Soccer", members: 22, nextMatch: "May 18, 2025", wins: 8, losses: 2 },
  { id: 2, name: "Eagles Basketball", sport: "Basketball", members: 15, nextMatch: "May 20, 2025", wins: 12, losses: 5 },
  { id: 3, name: "Sharks Swimming", sport: "Swimming", members: 18, nextMatch: "May 22, 2025", wins: 4, losses: 1 }
];

const initialEvents = [
  { id: 1, title: "Soccer Tournament", date: "May 18, 2025", location: "City Stadium", teams: ["Lions FC", "City United"] },
  { id: 2, title: "Basketball Finals", date: "May 20, 2025", location: "Sports Center", teams: ["Eagles Basketball", "Hawks"] },
  { id: 3, title: "Swimming Meet", date: "May 22, 2025", location: "Aquatic Center", teams: ["Sharks Swimming", "Dolphins"] }
];

const initialAthletes = [
  { 
    id: 1, 
    name: "John Smith", 
    team: "Lions FC", 
    position: "Forward", 
    status: "Active",
    healthData: {
      recentTrainingLoad: 85,
      sleepQuality: 76,
      fatigueLevel: 25,
      heartRateVariability: 62,
      injuryRisk: 18,
      healthScore: 82
    },
    healthHistory: [
      { date: "May 10, 2025", healthScore: 78 },
      { date: "May 11, 2025", healthScore: 73 },
      { date: "May 12, 2025", healthScore: 79 },
      { date: "May 13, 2025", healthScore: 82 }
    ]
  },
  { 
    id: 2, 
    name: "Sarah Johnson", 
    team: "Eagles Basketball", 
    position: "Point Guard", 
    status: "Injured",
    healthData: {
      recentTrainingLoad: 92,
      sleepQuality: 58,
      fatigueLevel: 72,
      heartRateVariability: 48,
      injuryRisk: 76,
      healthScore: 54
    },
    healthHistory: [
      { date: "May 10, 2025", healthScore: 72 },
      { date: "May 11, 2025", healthScore: 68 },
      { date: "May 12, 2025", healthScore: 61 },
      { date: "May 13, 2025", healthScore: 54 }
    ]
  },
  { 
    id: 3, 
    name: "Mike Brown", 
    team: "Sharks Swimming", 
    position: "Freestyle", 
    status: "Active",
    healthData: {
      recentTrainingLoad: 78,
      sleepQuality: 84,
      fatigueLevel: 30,
      heartRateVariability: 75,
      injuryRisk: 15,
      healthScore: 88
    },
    healthHistory: [
      { date: "May 10, 2025", healthScore: 83 },
      { date: "May 11, 2025", healthScore: 81 },
      { date: "May 12, 2025", healthScore: 85 },
      { date: "May 13, 2025", healthScore: 88 }
    ]
  }
];

export default function SportsManagementApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [teams, setTeams] = useState(initialTeams);
  const [events, setEvents] = useState(initialEvents);
  const [athletes, setAthletes] = useState(initialAthletes);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aiAnalysisEnabled, setAiAnalysisEnabled] = useState(true);
  const [aiSensitivity, setAiSensitivity] = useState(70);
  const [currentAthlete, setCurrentAthlete] = useState(null);
  const [showHealthModal, setShowHealthModal] = useState(false);
  
  // Form states
  const [newTeam, setNewTeam] = useState({ name: '', sport: '', members: 0 });
  const [newEvent, setNewEvent] = useState({ title: '', date: '', location: '', teams: [] });
  const [newAthlete, setNewAthlete] = useState({ 
    name: '', 
    team: '', 
    position: '', 
    status: 'Active',
    healthData: {
      recentTrainingLoad: 75,
      sleepQuality: 75,
      fatigueLevel: 25,
      heartRateVariability: 65,
      injuryRisk: 20,
      healthScore: 80
    }
  });
  
  // Simulate AI health status updates
  useEffect(() => {
    if (!aiAnalysisEnabled) return;
    
    const interval = setInterval(() => {
      // Simulate receiving new health data and updating athlete status
      setAthletes(currentAthletes => {
        return currentAthletes.map(athlete => {
          // Only update a random subset of athletes each time (20% chance)
          if (Math.random() > 0.2) return athlete;
          
          // Generate new simulated health data
          const trainingLoad = Math.min(100, Math.max(50, athlete.healthData.recentTrainingLoad + (Math.random() * 20 - 10)));
          const sleepQuality = Math.min(100, Math.max(40, athlete.healthData.sleepQuality + (Math.random() * 15 - 7.5)));
          const fatigueLevel = Math.min(100, Math.max(10, athlete.healthData.fatigueLevel + (Math.random() * 20 - 10)));
          const hrv = Math.min(100, Math.max(40, athlete.healthData.heartRateVariability + (Math.random() * 10 - 5)));
          
          // AI-based injury risk assessment (higher values = higher risk)
          // Factors: higher training load, lower sleep quality, higher fatigue, lower HRV all increase risk
          const injuryRisk = Math.min(100, Math.max(5, 
            (trainingLoad * 0.3) + 
            ((100 - sleepQuality) * 0.25) + 
            (fatigueLevel * 0.3) + 
            ((100 - hrv) * 0.15)
          ));
          
          // Overall health score (higher is better)
          const healthScore = Math.round(100 - (injuryRisk * 0.6));
          
          // Add to health history
          const today = new Date();
          const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
          const updatedHistory = [
            ...athlete.healthHistory, 
            { date: dateStr, healthScore }
          ].slice(-10); // Keep only last 10 records
          
          // AI determines status based on health score and sensitivity threshold
          let newStatus = athlete.status;
          const threshold = 100 - aiSensitivity; // Convert sensitivity to threshold
          
          if (healthScore < threshold) {
            // High risk - mark as injured or warning
            newStatus = healthScore < threshold - 15 ? "Injured" : "At Risk";
          } else {
            // Low risk - mark as active
            newStatus = "Active";
          }
          
          return {
            ...athlete,
            status: newStatus,
            healthData: {
              recentTrainingLoad: Math.round(trainingLoad),
              sleepQuality: Math.round(sleepQuality),
              fatigueLevel: Math.round(fatigueLevel),
              heartRateVariability: Math.round(hrv),
              injuryRisk: Math.round(injuryRisk),
              healthScore
            },
            healthHistory: updatedHistory
          };
        });
      });
    }, 15000); // Update every 15 seconds for demo purposes
    
    return () => clearInterval(interval);
  }, [aiAnalysisEnabled, aiSensitivity]);
  
  // Adding new items
  const addTeam = () => {
    if (newTeam.name && newTeam.sport) {
      const team = {
        id: teams.length + 1,
        ...newTeam,
        wins: 0,
        losses: 0,
        nextMatch: "TBD"
      };
      setTeams([...teams, team]);
      setNewTeam({ name: '', sport: '', members: 0 });
    }
  };
  
  const addEvent = () => {
    if (newEvent.title && newEvent.date && newEvent.location) {
      const event = {
        id: events.length + 1,
        ...newEvent,
        teams: newEvent.teams || []
      };
      setEvents([...events, event]);
      setNewEvent({ title: '', date: '', location: '', teams: [] });
    }
  };
  
  const addAthlete = () => {
    if (newAthlete.name && newAthlete.team) {
      const athlete = {
        id: athletes.length + 1,
        ...newAthlete,
        healthHistory: [
          { date: new Date().toISOString().split('T')[0], healthScore: newAthlete.healthData.healthScore }
        ]
      };
      setAthletes([...athletes, athlete]);
      setNewAthlete({ 
        name: '', 
        team: '', 
        position: '', 
        status: 'Active',
        healthData: {
          recentTrainingLoad: 75,
          sleepQuality: 75,
          fatigueLevel: 25,
          heartRateVariability: 65,
          injuryRisk: 20,
          healthScore: 80
        }
      });
    }
  };
  
  // Function to manually update health data (for demo)
  const updateHealthData = (athleteId, field, value) => {
    setAthletes(currentAthletes => {
      return currentAthletes.map(athlete => {
        if (athlete.id !== athleteId) return athlete;
        
        // Calculate new health data
        const newHealthData = { ...athlete.healthData, [field]: value };
        
        // Recalculate injury risk and health score
        const injuryRisk = Math.min(100, Math.max(5, 
          (newHealthData.recentTrainingLoad * 0.3) + 
          ((100 - newHealthData.sleepQuality) * 0.25) + 
          (newHealthData.fatigueLevel * 0.3) + 
          ((100 - newHealthData.heartRateVariability) * 0.15)
        ));
        
        const healthScore = Math.round(100 - (injuryRisk * 0.6));
        newHealthData.injuryRisk = Math.round(injuryRisk);
        newHealthData.healthScore = healthScore;
        
        // AI determines status based on health score and sensitivity threshold
        const threshold = 100 - aiSensitivity;
        let newStatus = athlete.status;
        
        if (healthScore < threshold) {
          // High risk - mark as injured or warning
          newStatus = healthScore < threshold - 15 ? "Injured" : "At Risk";
        } else {
          // Low risk - mark as active
          newStatus = "Active";
        }
        
        // Add to health history
        const today = new Date();
        const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        const updatedHistory = [
          ...athlete.healthHistory, 
          { date: dateStr, healthScore }
        ].slice(-10); // Keep only last 10 records
        
        return {
          ...athlete,
          status: newStatus,
          healthData: newHealthData,
          healthHistory: updatedHistory
        };
      });
    });
  };
  
  // Function to show health details modal
  const showAthleteHealth = (athlete) => {
    setCurrentAthlete(athlete);
    setShowHealthModal(true);
  };
  
  // Dashboard metrics
  const totalAthletes = athletes.length;
  const totalTeams = teams.length;
  const upcomingEvents = events.filter(event => new Date(event.date) > new Date()).length;
  const injuredAthletes = athletes.filter(athlete => athlete.status === "Injured").length;
  const atRiskAthletes = athletes.filter(athlete => athlete.status === "At Risk").length;
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex flex-col w-64 bg-blue-800 text-white">
        <div className="p-4 text-xl font-bold">Sports Manager</div>
        <nav className="flex-1">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center w-full px-4 py-3 ${activeTab === 'dashboard' ? 'bg-blue-900' : 'hover:bg-blue-700'}`}
          >
            <Home size={20} className="mr-3" />
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('teams')}
            className={`flex items-center w-full px-4 py-3 ${activeTab === 'teams' ? 'bg-blue-900' : 'hover:bg-blue-700'}`}
          >
            <Users size={20} className="mr-3" />
            Teams
          </button>
          <button 
            onClick={() => setActiveTab('events')}
            className={`flex items-center w-full px-4 py-3 ${activeTab === 'events' ? 'bg-blue-900' : 'hover:bg-blue-700'}`}
          >
            <Calendar size={20} className="mr-3" />
            Events
          </button>
          <button 
            onClick={() => setActiveTab('athletes')}
            className={`flex items-center w-full px-4 py-3 ${activeTab === 'athletes' ? 'bg-blue-900' : 'hover:bg-blue-700'}`}
          >
            <User size={20} className="mr-3" />
            Athletes
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex items-center w-full px-4 py-3 ${activeTab === 'settings' ? 'bg-blue-900' : 'hover:bg-blue-700'}`}
          >
            <Settings size={20} className="mr-3" />
            Settings
          </button>
        </nav>
      </div>
      
      {/* Mobile header */}
      <div className="md:hidden bg-blue-800 w-full fixed h-16 flex items-center justify-between px-4 text-white z-10">
        <div className="text-xl font-bold">Sports Manager</div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <Menu size={24} />
        </button>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 w-full bg-blue-800 text-white z-10">
          <nav>
            <button 
              onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
              className="flex items-center w-full px-4 py-3 hover:bg-blue-700"
            >
              <Home size={20} className="mr-3" />
              Dashboard
            </button>
            <button 
              onClick={() => { setActiveTab('teams'); setMobileMenuOpen(false); }}
              className="flex items-center w-full px-4 py-3 hover:bg-blue-700"
            >
              <Users size={20} className="mr-3" />
              Teams
            </button>
            <button 
              onClick={() => { setActiveTab('events'); setMobileMenuOpen(false); }}
              className="flex items-center w-full px-4 py-3 hover:bg-blue-700"
            >
              <Calendar size={20} className="mr-3" />
              Events
            </button>
            <button 
              onClick={() => { setActiveTab('athletes'); setMobileMenuOpen(false); }}
              className="flex items-center w-full px-4 py-3 hover:bg-blue-700"
            >
              <User size={20} className="mr-3" />
              Athletes
            </button>
            <button 
              onClick={() => { setActiveTab('settings'); setMobileMenuOpen(false); }}
              className="flex items-center w-full px-4 py-3 hover:bg-blue-700"
            >
              <Settings size={20} className="mr-3" />
              Settings
            </button>
          </nav>
        </div>
      )}
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden pt-16 md:pt-0">
        <main className="flex-1 overflow-y-auto p-4">
          {/* Dashboard View */}
          {activeTab === 'dashboard' && (
            <div>
              <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
              
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow p-4 flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <Users size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-500">Total Teams</p>
                    <p className="text-2xl font-bold">{totalTeams}</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-4 flex items-center">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <User size={24} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-500">Athletes</p>
                    <p className="text-2xl font-bold">{totalAthletes}</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-4 flex items-center">
                  <div className="bg-purple-100 p-3 rounded-full mr-4">
                    <Calendar size={24} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-gray-500">Upcoming Events</p>
                    <p className="text-2xl font-bold">{upcomingEvents}</p>
                  </div>
                </div>
              </div>

              {/* AI Health Status Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow p-4 flex items-center">
                  <div className="bg-red-100 p-3 rounded-full mr-4">
                    <AlertTriangle size={24} className="text-red-600" />
                  </div>
                  <div>
                    <p className="text-gray-500">Injured Athletes</p>
                    <p className="text-2xl font-bold">{injuredAthletes}</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-4 flex items-center">
                  <div className="bg-yellow-100 p-3 rounded-full mr-4">
                    <Activity size={24} className="text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-gray-500">At Risk Athletes</p>
                    <p className="text-2xl font-bold">{atRiskAthletes}</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-4 flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <Brain size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-500">AI Health Analysis</p>
                    <p className="text-lg font-medium">{aiAnalysisEnabled ? "Enabled" : "Disabled"}</p>
                  </div>
                </div>
              </div>
              
              {/* Recent Events */}
              <div className="bg-white rounded-lg shadow p-4 mb-6">
                <h2 className="text-lg font-semibold mb-4">Upcoming Events</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Event</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Date</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.slice(0, 3).map(event => (
                        <tr key={event.id} className="border-t">
                          <td className="px-4 py-3">{event.title}</td>
                          <td className="px-4 py-3">{event.date}</td>
                          <td className="px-4 py-3">{event.location}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Team Performance */}
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-lg font-semibold mb-4">Team Performance</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Team</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Sport</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">W/L</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teams.map(team => (
                        <tr key={team.id} className="border-t">
                          <td className="px-4 py-3">{team.name}</td>
                          <td className="px-4 py-3">{team.sport}</td>
                          <td className="px-4 py-3">{team.wins}-{team.losses}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          {/* Teams View */}
          {activeTab === 'teams' && (
            <div>
              <h1 className="text-2xl font-bold mb-6">Teams Management</h1>
              
              {/* Add Team Form */}
              <div className="bg-white rounded-lg shadow p-4 mb-6">
                <h2 className="text-lg font-semibold mb-4">Add New Team</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Team Name</label>
                    <input
                      type="text"
                      value={newTeam.name}
                      onChange={(e) => setNewTeam({...newTeam, name: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sport</label>
                    <input
                      type="text"
                      value={newTeam.sport}
                      onChange={(e) => setNewTeam({...newTeam, sport: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Members</label>
                    <input
                      type="number"
                      value={newTeam.members}
                      onChange={(e) => setNewTeam({...newTeam, members: parseInt(e.target.value)})}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
                <button 
                  onClick={addTeam}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Add Team
                </button>
              </div>
              
              {/* Teams List */}
              <div className="bg-white rounded-lg shadow">
                <h2 className="text-lg font-semibold p-4 border-b">Teams List</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Team Name</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Sport</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Members</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Next Match</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Record</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teams.map(team => (
                        <tr key={team.id} className="border-t">
                          <td className="px-4 py-3 font-medium">{team.name}</td>
                          <td className="px-4 py-3">{team.sport}</td>
                          <td className="px-4 py-3">{team.members}</td>
                          <td className="px-4 py-3">{team.nextMatch}</td>
                          <td className="px-4 py-3">{team.wins}-{team.losses}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          {/* Events View */}
          {activeTab === 'events' && (
            <div>
              <h1 className="text-2xl font-bold mb-6">Events Schedule</h1>
              
              {/* Add Event Form */}
              <div className="bg-white rounded-lg shadow p-4 mb-6">
                <h2 className="text-lg font-semibold mb-4">Add New Event</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                    <input
                      type="text"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="text"
                      placeholder="May 30, 2025"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
                <button 
                  onClick={addEvent}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Add Event
                </button>
              </div>
              
              {/* Events List */}
              <div className="bg-white rounded-lg shadow">
                <h2 className="text-lg font-semibold p-4 border-b">Upcoming Events</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Event</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Date</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Location</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Teams</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map(event => (
                        <tr key={event.id} className="border-t">
                          <td className="px-4 py-3 font-medium">{event.title}</td>
                          <td className="px-4 py-3">{event.date}</td>
                          <td className="px-4 py-3">{event.location}</td>
                          <td className="px-4 py-3">{event.teams.join(', ')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          {/* Athletes View */}
          {activeTab === 'athletes' && (
            <div>
              <h1 className="text-2xl font-bold mb-6">Athletes Management</h1>
              
              {/* Add Athlete Form */}
              <div className="bg-white rounded-lg shadow p-4 mb-6">
                <h2 className="text-lg font-semibold mb-4">Add New Athlete</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={newAthlete.name}
                      onChange={(e) => setNewAthlete({...newAthlete, name: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Team</label>
                    <select
                      value={newAthlete.team}
                      onChange={(e) => setNewAthlete({...newAthlete, team: e.target.value})}
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Select Team</option>
                      {teams.map(team => (
                        <option key={team.id} value={team.name}>{team.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                    <input
                      type="text"
                      value={newAthlete.position}
                      onChange={(e) => setNewAthlete({...newAthlete, position: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={newAthlete.status}
                      onChange={(e) => setNewAthlete({...newAthlete, status: e.target.value})}
                      className="w-full p-2 border rounded"
                    >
                      <option value="Active">Active</option>
                      <option value="Injured">Injured</option>
                      <option value="Reserve">Reserve</option>
                    </select>
                  </div>
                </div>
                <button 
                  onClick={addAthlete}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Add Athlete
                </button>
              </div>
              
              {/* Athletes List */}
              <div className="bg-white rounded-lg shadow">
                <h2 className="text-lg font-semibold p-4 border-b">Athletes List</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Name</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Team</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Position</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {athletes.map(athlete => (
                        <tr key={athlete.id} className="border-t">
                          <td className="px-4 py-3 font-medium">{athlete.name}</td>
                          <td className="px-4 py-3">{athlete.team}</td>
                          <td className="px-4 py-3">{athlete.position}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              athlete.status === 'Active' ? 'bg-green-100 text-green-800' :
                              athlete.status === 'Injured' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {athlete.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          {/* Settings View */}
          {activeTab === 'settings' && (
            <div>
              <h1 className="text-2xl font-bold mb-6">App Settings</h1>
              
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-lg font-semibold mb-4">Account Settings</h2>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                  <input type="text" defaultValue="Sports Organization" className="w-full md:w-1/2 p-2 border rounded" />
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Notifications</label>
                  <div className="flex items-center mt-2">
                    <input type="checkbox" id="emailNotif" defaultChecked className="mr-2" />
                    <label htmlFor="emailNotif">Receive email notifications</label>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Time Zone</h3>
                  <select className="w-full md:w-1/2 p-2 border rounded">
                    <option>Eastern Time (ET)</option>
                    <option>Central Time (CT)</option>
                    <option>Mountain Time (MT)</option>
                    <option>Pacific Time (PT)</option>
                  </select>
                </div>
                
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}