import React, { useState } from 'react';
import { Copy } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUser } from '@clerk/clerk-react';

const Leaderboard = () => {
  const [view, setView] = useState('24h');
  const [leaderboardType, setLeaderboardType] = useState('appWide');
  const [selectedPlayer, setSelectedPlayer] = useState(null); 
  const { user, isLoaded, isSignedIn } = useUser();

  const appWideLeaderboardData = [
    { place: 1, name: 'EcoWarrior', co2Reduction: '40%', practices: 5, impactScore: 95 },
    { place: 2, name: 'GreenGiant', co2Reduction: '35%', practices: 4, impactScore: 90 },
    { place: 3, name: 'SustainableSam', co2Reduction: '30%', practices: 3, impactScore: 85 },
    { place: 4, name: 'PlanetProtector', co2Reduction: '28%', practices: 3, impactScore: 80 },
    { place: 5, name: 'EcoFriendly', co2Reduction: '25%', practices: 2, impactScore: 75 },
    { place: 6, name: 'GreenThumb', co2Reduction: '20%', practices: 2, impactScore: 70 },
    { place: 7, name: 'WasteWatcher', co2Reduction: '15%', practices: 1, impactScore: 65 },
    { place: 8, name: 'NatureLover', co2Reduction: '10%', practices: 1, impactScore: 60 },
    { place: 9, name: 'RecycleRanger', co2Reduction: '5%', practices: 1, impactScore: 55 },
    { place: 10, name: 'ClimateChampion', co2Reduction: '3%', practices: 0, impactScore: 50 }
  ];

  const friendsLeaderboardData = [
    { place: 1, name: 'EcoBuddy1', co2Reduction: '50%', practices: 6, impactScore: 98 },
    { place: 2, name: 'GreenPal', co2Reduction: '45%', practices: 5, impactScore: 93 },
    { place: 3, name: 'SustainableFriend', co2Reduction: '38%', practices: 4, impactScore: 88 },
    { place: 4, name: 'SustainableSam', co2Reduction: '30%', practices: 3, impactScore: 85 },
    { place: 5, name: 'PlanetProtector', co2Reduction: '28%', practices: 3, impactScore: 80 },
    { place: 6, name: 'EcoFriendly', co2Reduction: '25%', practices: 2, impactScore: 75 },
    { place: 7, name: 'GreenThumb', co2Reduction: '20%', practices: 2, impactScore: 70 }
  ];

  const handleLeaderboardTypeChange = (type) => {
    setLeaderboardType(type);
  };

  const accountData = {
    name: user.fullName,
    profileImage: user.imageUrl,
    accountInfo: {
      co2Reduction: '35%',
      practices: 3,
      impactScore: 88,
    },
  };

  const leaderboardData = leaderboardType === 'appWide' ? appWideLeaderboardData : friendsLeaderboardData;

  return (
    <div className="min-h-screen bg-white dark:bg-black p-6 md:p-12">

      {/* Account Info Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
        <div className="flex items-center mb-4 sm:mb-0">
          <img
            src={accountData.profileImage}
            alt="Profile"
            className="w-20 h-20 rounded-full mr-4 border-4 border-green-600 shadow-lg"
          />
          <div>
            <h2 className="text-3xl font-bold text-green-800">{accountData.name}</h2>
            <div className="flex flex-col mt-2 text-sm text-gray-600">
              <p>CO2 Reduction: {accountData.accountInfo.co2Reduction}</p>
              <p>Sustainable Practices: {accountData.accountInfo.practices}</p>
              <p>Impact Score: {accountData.accountInfo.impactScore}</p>
            </div>
          </div>
        </div>

        {/* Share Profile Button with Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <button className="border-2 border-green-800 rounded px-4 py-2 hover:bg-gray-100 dark:hover:bg-green-950">
              Share Profile
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Share Profile Link</DialogTitle>
              <DialogDescription>
                Copy the link to share your profile with others!
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <input
                  id="profileLink"
                  type="text"
                  value="https://profilelink.com/" // Example link
                  readOnly
                  className="border px-2 py-1 rounded w-full text-sm"
                />
              </div>
              <button type="button" className="px-3 border border-gray-300 rounded hover:bg-gray-100">
                <span className="sr-only">Copy</span>
                <Copy className="h-4 w-4" />
              </button>
            </div>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <button type="button" className="px-4 py-2 bg-gray-300 dark:bg-gray-950 rounded hover:bg-gray-400">
                  Close
                </button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <hr className="border-t border-gray-300 my-6" />

      {/* Leaderboard Type Buttons and Invite Friends */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <div className="flex space-x-4">
          <button
            className={`${
              leaderboardType === 'appWide' ? 'bg-green-200 dark:bg-green-950 text-black dark:text-white' : 'bg-white text-black'
            } border-2 border-green-600 rounded-lg px-4 py-2 transition-all hover:bg-green-600 hover:text-white`}
            onClick={() => handleLeaderboardTypeChange('appWide')}
          >
            App-Wide Leaderboard
          </button>
          <button
            className={`${
              leaderboardType === 'friends' ? 'bg-green-200 text-black' : 'bg-white dark:bg-black text-black dark:text-white'
            } border-2 border-green-600 rounded-lg px-4 py-2 transition-all hover:bg-green-600 hover:text-white`}
            onClick={() => handleLeaderboardTypeChange('friends')}
          >
            Friends Leaderboard
          </button>
        </div>

        {/* Invite Friends Modal */}
        <Dialog>
          <DialogTrigger asChild>
            <button className="border-2 rounded px-4 py-2 border-green-800 hover:bg-gray-100 mt-4 sm:mt-0">Invite Friends</button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Enter Profile Link</DialogTitle>
              <DialogDescription>
                Enter the profile link of your friend to invite them!
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <input
                  id="friendLink"
                  type="text"
                  placeholder="Enter your friend's profile link"
                  className="border px-2 py-1 rounded w-full text-sm"
                />
              </div>
              <button type="button" className="px-3 border border-gray-300 rounded hover:bg-gray-100">
                <span className="sr-only">Copy</span>
                <Copy className="h-4 w-4" />
              </button>
            </div>
            <DialogFooter className="sm:justify-start">
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Add Friend</button>
              <DialogClose asChild>
                <button type="button" className="px-4 py-2 bg-gray-300 dark:bg-black rounded hover:bg-gray-400">
                  Close
                </button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Top 3 Players Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    {leaderboardData.slice(0, 3).map((player) => (
        <div
            key={player.place}
            className={`relative p-8 rounded-xl shadow-lg transform transition-transform hover:-translate-y-2 bg-gradient-to-br ${
                player.place === 1
                    ? 'from-yellow-100 to-yellow-300'
                    : player.place === 2
                    ? 'from-gray-100 to-gray-300'
                    : 'from-orange-100 to-orange-300'
            } border ${
                player.place === 1
                    ? 'border-yellow-500'
                    : player.place === 2
                    ? 'border-gray-500'
                    : 'border-orange-500'
            }`}
        >
            {/* Top Badge with Crown/Icon */}
            <div className="absolute -top-4 -right-4 flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-md border-4 border-white dark:border-black">
                <span
                    className={`text-3xl ${
                        player.place === 1
                            ? 'text-yellow-500'
                            : player.place === 2
                            ? 'text-gray-500'
                            : 'text-orange-500'
                    }`}
                >
                    {player.place === 1 ? '👑' : player.place === 2 ? '🥈' : '🥉'}
                </span>
            </div>

            {/* Player Name and Ranking */}
            <div className="flex flex-col items-start space-y-1">
                <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white">{player.name}</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">Rank {player.place}</p>
            </div>

            {/* Player Details */}
            <div className="mt-4 space-y-2">
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                    <span className="font-bold text-gray-800 dark:text-gray-200">CO2 Reduction:</span> {player.co2Reduction}
                </p>
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                    <span className="font-bold text-gray-800 dark:text-gray-200">Practices:</span> {player.practices}
                </p>
            </div>

            {/* Impact Score Progress Bar */}
            <div className="mt-4">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Impact Score</span>
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{player.impactScore}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                    <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                            player.place === 1 ? 'bg-yellow-500' : player.place === 2 ? 'bg-gray-500' : 'bg-orange-500'
                        }`}
                        style={{ width: `${player.impactScore}%` }}
                    ></div>
                </div>
            </div>
        </div>
    ))}
</div>


      {/* Leaderboard Table Section */}
<div className="overflow-x-auto">
    <table className="min-w-full bg-white dark:bg-gray-950 border border-gray-300 rounded-lg shadow-md">
        <thead className="sticky top-0 z-10 bg-green-100 dark:bg-green-950">
            <tr>
                <th className="py-3 px-5 text-left font-semibold text-gray-700 dark:text-gray-300">Rank</th>
                <th className="py-3 px-5 text-left font-semibold text-gray-700 dark:text-gray-300">Name</th>
                <th className="py-3 px-5 text-left font-semibold text-gray-700 dark:text-gray-300">CO2 Reduction</th>
                <th className="py-3 px-5 text-left font-semibold text-gray-700 dark:text-gray-300">Practices</th>
                <th className="py-3 px-5 text-left font-semibold text-gray-700 dark:text-gray-300">Impact Score</th>
            </tr>
        </thead>
        <tbody>
            {leaderboardData.map((player, index) => (
                <tr
                    key={player.place}
                    className={`${
                        index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'
                    } hover:bg-gray-100 dark:hover:bg-gray-700 transition-all cursor-pointer`}
                    onClick={() => setSelectedPlayer(player)}
                >
                    <td className="py-3 px-5 border-b text-center text-gray-700 dark:text-gray-300">{player.place}</td>
                    <td className="py-3 px-5 border-b text-gray-700 dark:text-gray-300">{player.name}</td>
                    <td className="py-3 px-5 border-b text-center text-gray-700 dark:text-gray-300">{player.co2Reduction}</td>
                    <td className="py-3 px-5 border-b text-center text-gray-700 dark:text-gray-300">{player.practices}</td>
                    <td className="py-3 px-5 border-b text-center text-gray-700 dark:text-gray-300">{player.impactScore}</td>
                </tr>
            ))}
        </tbody>
    </table>
</div>


      {/* Player Profile Dialog */}
      {selectedPlayer && (
    <Dialog open={!!selectedPlayer} onOpenChange={(open) => !open && setSelectedPlayer(null)}>
        <DialogContent className="sm:max-w-md p-6 rounded-lg shadow-xl bg-white dark:bg-gray-900 animate-fadeIn">
            <DialogHeader>
                <DialogTitle className="text-xl font-bold text-gray-800 dark:text-white">{selectedPlayer.name}'s Profile</DialogTitle>
                <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
                    Detailed profile of {selectedPlayer.name}.
                </DialogDescription>
            </DialogHeader>
            
            {/* Profile Image */}
            <div className="flex flex-col items-center space-y-4 mt-4">
                <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <img src="/path-to-placeholder-image.jpg" alt={`${selectedPlayer.name} profile`} className="object-cover w-full h-full"/>
                </div>
                
                <div className="text-center">
                    <p className="text-gray-700 dark:text-gray-300">
                        <strong>CO2 Reduction:</strong> {selectedPlayer.co2Reduction}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                        <strong>Practices:</strong> {selectedPlayer.practices}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                        <strong>Impact Score:</strong> {selectedPlayer.impactScore}
                    </p>
                </div>
            </div>

            {/* Footer with Close Button */}
            <DialogFooter className="mt-6 sm:justify-center">
                <DialogClose asChild>
                    <button
                        type="button"
                        className="px-6 py-2 font-semibold text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-all"
                    >
                        Close
                    </button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
)}
    </div>
  );
};

export default Leaderboard;
