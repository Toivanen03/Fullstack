import { useState, useEffect } from 'react';
import { DiaryEntry } from './types';
import { getAllDiaries, createDiaryEntry } from './services/diaryService';
import './App.css'

const App = () => {
  const [diaries, setDiary] = useState<DiaryEntry[]>([]);
  const [newDiaryDate, setNewDiaryDate] = useState('');
  const [newDiaryWeather, setNewDiaryWeather] = useState('');
  const [newDiaryVisibility, setNewDiaryVisibility] = useState('');
  const [newDiaryComment, setNewDiaryComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getAllDiaries().then(data => {
      setDiary(data)
    })
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 10000);
  
      return () => clearTimeout(timer);
    }
  }, [error]);

  const diaryCreation = (event: React.SyntheticEvent) => {
    event.preventDefault()
    createDiaryEntry({
      date: newDiaryDate, 
      weather: newDiaryWeather, 
      visibility: newDiaryVisibility, 
      comment: newDiaryComment 
    }, setError).then(data => {
      if (data) {
        setDiary([...diaries, data]);
        setNewDiaryDate('');
        setNewDiaryWeather('');
        setNewDiaryVisibility('');
        setNewDiaryComment('');
      };
    });
  };

  const showOrHideComments = () => {
    setShowComments(!showComments);
  };

  return (

    <div className='main'>
      <h1>Ilari's Flights</h1>
      <div className='container'>
        <div className='container-left'>
          <h2>Add new flight:</h2>

          <form onSubmit={diaryCreation}>
            <div className={'left-text'}>Flight date:</div>
            <input
              value={newDiaryDate}
              onChange={(event) => setNewDiaryDate(event.target.value)} 
            /><span className='hint'>YYYY-MM-DD</span>
            <br />
            <div className='left-text'>Weather:</div>
            <input
              value={newDiaryWeather}
              onChange={(event) => setNewDiaryWeather(event.target.value)} 
            /><span className='hint'>sunny, rainy, cloudy, stormy, windy</span>
            <br />
            <div className='left-text'>Visibility:</div>
            <input
              value={newDiaryVisibility}
              onChange={(event) => setNewDiaryVisibility(event.target.value)} 
            /><span className='hint'>great, good, ok, poor</span>
            <br />
            <div className='left-text'>Comment:</div>
            <input
              value={newDiaryComment}
              onChange={(event) => setNewDiaryComment(event.target.value)} 
            /><span className='hint'>Free text</span>
            <br />
            <button type='submit'>add</button>
          </form>
          <div style={{ whiteSpace: 'pre-line', color: 'red' }}>
            {error}
          </div>
        </div>

        <div className='container-right'>
          <div className='header-container'>
            <h2>Previous flights:</h2>
            <button className='commentButton' onClick={showOrHideComments}>
              {showComments ? 'Hide flight comments' : 'Show flight comments'}
            </button>
          </div>

          <ul>
            {diaries.map(diary =>
              <li key={diary.id}>
                Date: {diary.date}
                <br />
                Weather: {diary.weather}
                <br />
                Visibility: {diary.visibility}
                <br />
                {showComments && <span>Comments: <b>{diary.comment}</b></span>}
              </li>
            )} 
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
