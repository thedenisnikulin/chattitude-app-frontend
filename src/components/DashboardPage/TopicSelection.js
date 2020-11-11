import React, { useEffect, useState } from 'react';

const TopicSelection = (props) => {
    const TOPICS = [
      'random', 'programming', 'design', 'history', 
      'sport', 'politics', 'foreign_languages', 
      'media', 'anime', 'art', 'music','business', 
      'rap_music', 'rock_music', 'drawing', 'movies', 
      'health_care', 'news','mathematics', 'literature'
    ].sort();
    const { room, setRoom } = props.roomState;
    const [ changeableTopics, setChangeableTopics ] = useState([]);
    const [ topic, setTopic ] = useState('');
  
    const handleButtonClick = (e) => {
      e.preventDefault();
      let value = e.target.value.slice(1);
      console.log('e ' + value)
      setRoom({ ...room, topic: value});
    }
    useEffect(() => {
      console.log(room)
    }, [room])
  
    useEffect(() => {
      if (topic === '') {
        setChangeableTopics(TOPICS);
      } else {
        setChangeableTopics(TOPICS.filter(t => t.includes(topic)));
      } 
      
    }, [topic])
  
    const handleSearchChange = (e) => {
      e.preventDefault();
      setTopic(e.target.value);
    }
  
    return(
      <div className="topic-selection">
        <input
          className="search-input"
          placeholder='search...' 
          onChange={handleSearchChange}
        />
        <div className="topics">
          {
            changeableTopics.map(topic => 
              <input className="topic" type='button' value={'#' + topic} onClick={handleButtonClick} />
            )
          }
        </div>
      </div>
    );
}

export default TopicSelection;