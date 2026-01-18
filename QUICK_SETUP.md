# 🚀 Quick Setup Guide - Anti-Double Voting

## Prerequisites
```bash
cd frontend
npm install @fingerprintjs/fingerprintjs
```

## Step 1: Import Voter Identity Utils

```javascript
import { getVoterIdentity } from '../../utils/voterIdentity';
```

## Step 2: Initialize in Component

```javascript
const [voterIdentity, setVoterIdentity] = useState(null);
const [hasVoted, setHasVoted] = useState(false);

useEffect(() => {
  const init = async () => {
    // Get voter identity (token + fingerprint)
    const identity = await getVoterIdentity();
    setVoterIdentity(identity);
    
    // Check if already voted
    const status = await pollService.checkHasVoted(
      pollId, 
      identity.voterToken, 
      identity.fingerprint
    );
    
    setHasVoted(status.hasVoted);
  };
  
  init();
}, [pollId]);
```

## Step 3: Vote with Identity

```javascript
const handleVote = async (optionIndex) => {
  if (!voterIdentity) return;
  
  try {
    await pollService.votePoll(
      pollId,
      optionIndex,
      voterIdentity.voterToken,
      voterIdentity.fingerprint
    );
    
    setHasVoted(true);
    alert('Vote submitted! ✅');
    
  } catch (error) {
    if (error.response?.status === 403) {
      alert('You have already voted!');
      setHasVoted(true);
    }
  }
};
```

## That's it! 🎉

### What Happens:
1. ✅ User gets unique voterToken (stored in localStorage)
2. ✅ User gets unique fingerprint (based on browser/device)
3. ✅ Both sent to backend on vote
4. ✅ Backend checks VoterLog for duplicate
5. ✅ If found → Reject vote
6. ✅ If not found → Allow vote + Save to VoterLog

### Protection:
- ✅ Prevents double voting
- ✅ Works without login
- ✅ Survives cache clear (fingerprint)
- ✅ Survives incognito mode (fingerprint)
- ✅ Real-time updates via Socket.io

### Files to Check:
- Backend: `controllers/pollController.js` (votePoll function)
- Backend: `controllers/userController.js` (hasUserVotedPoll function)
- Frontend: `utils/voterIdentity.js` (voter identity management)
- Frontend: `services/pollService.js` (API calls)
- Example: `pages/user/PollDetailPage.example.jsx` (full implementation)

### Documentation:
- Full docs: `ANTI_DOUBLE_VOTING_README.md`
- Socket.io guide: `backend/SOCKET_README.md`
