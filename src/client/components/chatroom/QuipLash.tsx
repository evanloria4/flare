import React, { useEffect, useState, useCallback, useContext, useRef, ref } from 'react';
import { Application, extend, useAssets } from '@pixi/react';
import {
  Container,
  Graphics,
  Sprite,
  Texture,
  Assets,
  NineSliceSprite, // failing
  Text,
  TextStyle,
  Spritesheet, // failing
  AnimatedSprite,
} from 'pixi.js';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import MagicCard from '../../components/ui/magicCard';
import { InteractiveHoverButton } from '../../components/ui/interactive-hover-button';
import bartender from '../../assets/images/bartender.jpg'

// 'extend' is unique to the beta version of pixi.js
// With this beta version, everything you import from pixijs
// must be passed into extend. Then you can utilize them as components
// prefixed with pixi ex. <pixiContainer/> <pixiGraphics/>

extend({
  Container,
  Graphics,
  Sprite,
  Texture,
  NineSliceSprite,
  Text,
  TextStyle,
  AnimatedSprite,
  Texture, // not worth it w/ useAssets...?
});

const style = new TextStyle({
  align: 'center',
  fontFamily: 'sans-serif',
  fontSize: 15,
  fontWeight: 'bold',
  fill: '#000000',
  stroke: '#eef1f5',
  letterSpacing: 5,
  wordWrap: true,
  wordWrapWidth: 350,
});

function QuipLash() {


  // LOGIC
 // const { user } = useContext(UserContext);
  const [allPlayers, setAllPlayers] = useState([]);
  const [eventId, setEventId] = useState(document.location.pathname.slice(10));
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [allMessages, setAllMessages] = useState([]);
  const [gameWidth, setGameWidth] = useState(window.innerWidth);
  const [gameHeight, setGameHeight] = useState(window.innerHeight);
  const displayMessage = (msg: string) => {
    setAllMessages((prevMessages) => [...prevMessages, msg]);
  };
  // QUIPLASH
  const [isPlayingQuiplash, setIsPlayingQuiplash] = useState(false);


  // EXAMPLES
  const speechBubble = useCallback((graphics: unknown) => {
    graphics?.texture(Assets.get('speech'), 0xffffff, 10, -200, 180);
    graphics?.scale.set(1.5, 0.5);
  }, []);

  // WINDOW SIZING
  useEffect(() => {
    const handleResize = () => {
      setGameWidth(window.innerWidth);
      setGameHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // SOCKET ACTIVITY & MAP LOAD
  useEffect(() => {
    // axios.get(`api/chatroom/${eventId}`).catch((err) => console.error(err));
    // socket.emit('joinChat', { user, eventId });
    // socket.on('message', (msg) => {
    //   displayMessage(msg);
    //   // Update UI with the new message
    // });
    // // Update state of all players and their respective positions
    // socket.on('newPositions', (data) => {
    //   let allPlayerInfo = [];
    //   for (let i = 0; i < data.length; i++) {
    //     if (data[i].room === eventId) {
    //       allPlayerInfo.push({
    //         id: data[i].id,
    //         x: data[i].x,
    //         y: data[i].y,
    //         username: data[i].username,
    //         sentMessage: data[i].sentMessage,
    //         currentMessage: data[i].currentMessage,
    //         room: data[i].room,
    //       });
    //     }
    //   }
    //   setAllPlayers(allPlayerInfo);
    // });
  }, []);

  const typing = async () => {
    await setIsTyping(!isTyping);
  };

  const sendMessage = () => {
    console.log(message);
    socket.emit('message', { message, eventId });
    displayMessage(message);
    setMessage('');
  };

  return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '20px',
        }}
      >
        <div style={{ width: { gameWidth }, height: { gameHeight } }}>
          <Application>
            <pixiContainer x={100} y={200}>
            </pixiContainer>

            {/* <pixiAnimatedSprite

              anchor={0.5}
              textures={anim}
              isPlaying={true}
              initialFrame={0}
              animationSpeed={0.1666}
              x={35}
              y={50}
              loop={true}
            /> */}
          </Application>
      </div>

    </div>
  );
}

export default QuipLash;
