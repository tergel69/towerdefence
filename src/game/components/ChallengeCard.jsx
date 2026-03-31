import React from 'react';
import { getDailyChallenge, getNextChallengeInfo, getChallengeState, getDifficultyColor } from '../system/challengeSystem';

/**
 * ChallengeCard - Displays the daily challenge
 */
export default function ChallengeCard({ onStartChallenge }) {
  const challenge = getDailyChallenge();
  const { nextChallenge, resetsIn } = getNextChallengeInfo();
  const challengeState = getChallengeState();
  
  const today = new Date().toDateString();
  const isCompleted = challengeState.date === today && challengeState.completed;
  
  if (!challenge) return null;
  
  const difficultyColor = getDifficultyColor(challenge.difficulty);
  
  return (
    <div style={{
      padding: 16,
      borderRadius: 14,
      background: 'linear-gradient(135deg, rgba(15,23,42,0.96), rgba(30,41,59,0.92))',
      border: '1px solid rgba(255,255,255,0.08)',
      boxShadow: '0 18px 40px rgba(0,0,0,0.25)',
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 12
      }}>
        <div style={{ 
          fontSize: 10, 
          letterSpacing: '0.16em', 
          color: 'rgba(255,255,255,0.45)', 
          textTransform: 'uppercase' 
        }}>
          Daily Challenge
        </div>
        <div style={{
          fontSize: 11,
          color: 'rgba(255,255,255,0.4)'
        }}>
          Resets in {resetsIn}
        </div>
      </div>
      
      {/* Challenge Name */}
      <div style={{ 
        fontSize: 18, 
        fontWeight: 700, 
        color: '#f8fafc',
        marginBottom: 4
      }}>
        {challenge.name}
      </div>
      
      {/* Difficulty Badge */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 10px',
        borderRadius: 20,
        background: `${difficultyColor}22`,
        border: `1px solid ${difficultyColor}44`,
        marginBottom: 8
      }}>
        <span style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: difficultyColor,
          marginRight: 6
        }} />
        <span style={{ fontSize: 11, color: difficultyColor, textTransform: 'capitalize' }}>
          {challenge.difficulty}
        </span>
      </div>
      
      {/* Description */}
      <div style={{ 
        fontSize: 13, 
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 12,
        lineHeight: 1.5
      }}>
        {challenge.description}
      </div>
      
      {/* Reward */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        marginBottom: 14
      }}>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Reward:</span>
        <span style={{ fontSize: 16, fontWeight: 700, color: '#fbbf24' }}>
          {challenge.reward}g
        </span>
        {challengeState.streak > 0 && (
          <span style={{
            fontSize: 10,
            color: '#4ade80',
            background: 'rgba(74,222,128,0.15)',
            padding: '2px 8px',
            borderRadius: 10,
            marginLeft: 8
          }}>
            🔥 {challengeState.streak} day streak
          </span>
        )}
      </div>
      
      {/* Status / Action */}
      {isCompleted ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          padding: '12px 16px',
          borderRadius: 10,
          background: 'rgba(74,222,128,0.15)',
          border: '1px solid rgba(74,222,128,0.3)'
        }}>
          <span style={{ fontSize: 18 }}>✅</span>
          <span style={{ color: '#4ade80', fontWeight: 600 }}>Completed!</span>
        </div>
      ) : (
        <button
          onClick={onStartChallenge}
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: 10,
            border: 'none',
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            color: '#fff',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 20px rgba(37,99,235,0.4)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          Take Challenge
        </button>
      )}
      
      {/* Next challenge preview */}
      {isCompleted && nextChallenge && (
        <div style={{
          marginTop: 12,
          padding: 10,
          borderRadius: 8,
          background: 'rgba(255,255,255,0.04)',
          fontSize: 11,
          color: 'rgba(255,255,255,0.5)',
          textAlign: 'center'
        }}>
          Tomorrow: <span style={{ color: 'rgba(255,255,255,0.8)' }}>{nextChallenge.name}</span>
        </div>
      )}
    </div>
  );
}