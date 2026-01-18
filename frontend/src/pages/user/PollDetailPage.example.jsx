// Example implementation in PollDetailPage.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { socket, connectSocket, disconnectSocket } from '../../config/socket';
import { pollService } from '../../services/pollService';
import { getVoterIdentity } from '../../utils/voterIdentity';

const PollDetailPage = () => {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [voterIdentity, setVoterIdentity] = useState(null);

  // 1. Initialize voter identity and check vote status
  useEffect(() => {
    const initializeVoter = async () => {
      try {
        // Get voter identity (token + fingerprint)
        const identity = await getVoterIdentity();
        setVoterIdentity(identity);
        console.log('Voter Identity:', identity);

        // Fetch poll data
        const pollData = await pollService.getPollById(id);
        setPoll(pollData);

        // Check if user has already voted
        try {
          const voteStatus = await pollService.checkHasVoted(
            id, 
            identity.voterToken, 
            identity.fingerprint
          );
          
          if (voteStatus.hasVoted) {
            setHasVoted(true);
            console.log('✅ User has already voted at:', voteStatus.votedAt);
          } else {
            console.log('✅ User has not voted yet');
          }
        } catch (error) {
          console.error('Error checking vote status:', error);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error initializing:', error);
        setLoading(false);
      }
    };

    initializeVoter();

    // Connect to Socket.io
    connectSocket();
    socket.emit('join_poll', id);

    return () => {
      socket.off('vote_update');
      disconnectSocket();
    };
  }, [id]);

  // 2. Listen for real-time updates
  useEffect(() => {
    const handleVoteUpdate = (data) => {
      console.log('Vote update received:', data);
      
      setPoll((prevPoll) => ({
        ...prevPoll,
        options: data.options,
        totalVotes: data.totalVotes,
      }));
    };

    socket.on('vote_update', handleVoteUpdate);

    return () => {
      socket.off('vote_update', handleVoteUpdate);
    };
  }, []);

  // 3. Handle voting with identity verification
  const handleVote = async (optionIndex) => {
    if (hasVoted) {
      alert('You have already voted in this poll!');
      return;
    }

    if (!voterIdentity) {
      alert('Voter identity not initialized. Please refresh the page.');
      return;
    }

    if (voting) {
      return; // Prevent double submission
    }

    try {
      setVoting(true);

      // Send vote with voter identity
      const updatedPoll = await pollService.votePoll(
        id,
        optionIndex,
        voterIdentity.voterToken,
        voterIdentity.fingerprint
      );

      // Update local state
      setPoll(updatedPoll);
      setHasVoted(true);
      
      alert('Vote submitted successfully! ✅');
      
    } catch (error) {
      console.error('Error voting:', error);
      
      if (error.response?.status === 403) {
        // User has already voted
        setHasVoted(true);
        alert('You have already voted in this poll!');
      } else {
        alert('Failed to submit vote. Please try again.');
      }
    } finally {
      setVoting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading poll...</p>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="error-container">
        <p>Poll not found</p>
      </div>
    );
  }

  return (
    <div className="poll-detail">
      <div className="poll-header">
        <h1>{poll.title}</h1>
        <p>{poll.description}</p>
        {poll.category && (
          <span className="category-badge">{poll.category}</span>
        )}
      </div>

      <div className="poll-question">
        <h2>{poll.question}</h2>
      </div>

      {hasVoted && (
        <div className="alert alert-info">
          ✅ You have already voted in this poll. Results are shown below.
        </div>
      )}

      <div className="poll-options">
        {poll.options.map((option, index) => {
          const percentage = poll.totalVotes > 0 
            ? ((option.votes / poll.totalVotes) * 100).toFixed(1)
            : 0;

          return (
            <div key={index} className="option-card">
              <button
                onClick={() => handleVote(index)}
                disabled={hasVoted || voting || poll.status === 'closed'}
                className={`option-button ${hasVoted ? 'voted' : ''} ${voting ? 'voting' : ''}`}
              >
                <div className="option-content">
                  <span className="option-text">{option.optionText}</span>
                  <span className="option-stats">
                    <span className="votes">{option.votes} votes</span>
                    <span className="percentage">({percentage}%)</span>
                  </span>
                </div>
              </button>
              
              {/* Progress bar */}
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: hasVoted ? '#10b981' : '#3b82f6'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="poll-footer">
        <div className="poll-stats">
          <p>Total Votes: <strong>{poll.totalVotes}</strong></p>
          <p>Status: <span className={`status-badge ${poll.status}`}>{poll.status}</span></p>
        </div>
        
        {poll.createdBy && (
          <div className="poll-creator">
            <p>Created by: {poll.createdBy.name}</p>
          </div>
        )}
      </div>

      {/* Debug info (remove in production) */}
      {process.env.NODE_ENV === 'development' && voterIdentity && (
        <div className="debug-info" style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          background: '#f3f4f6',
          borderRadius: '8px',
          fontSize: '0.875rem'
        }}>
          <h3>Debug Info</h3>
          <p><strong>Voter Token:</strong> {voterIdentity.voterToken.substring(0, 8)}...</p>
          <p><strong>Fingerprint:</strong> {voterIdentity.fingerprint.substring(0, 16)}...</p>
          <p><strong>Has Voted:</strong> {hasVoted ? 'Yes' : 'No'}</p>
        </div>
      )}
    </div>
  );
};

export default PollDetailPage;
