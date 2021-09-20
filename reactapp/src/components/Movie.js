import React, {useState}  from 'react';
import '../App.css';
import { 
  Button,
  Col,
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardText,
  Badge,
  ButtonGroup,
 } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faStar, faVideo} from '@fortawesome/free-solid-svg-icons';

function Movie(props) {

  // variable d'état pour changer la couleur du picto caméra
  const [watchMovie, setWatchMovie] = useState(false);
  // variable d'état pour augmenter le nombre de vue
  const [countWatchMovie, setCountWatchMovie] = useState(0);
  // variable d'état pour augmenter le nombre de d'étoiles
  const [myRatingMovie, setMyRatingMovie] = useState(0);
  // variable d'état pour savoir si on a voté
  const [voteBooleen, setVoteBooleen] = useState(false);
  
  let globalCountRating = props.globalCountRating;

  // si like movie est true on crée la clé color sur l'objet style du picto coeur
  const styleCoeur = {cursor: 'pointer'};
  if (props.isLike) {
    styleCoeur.color = '#e74c3c';
  };

  let colorWatch = {}
  if(watchMovie){
    colorWatch = {color: '#e74c3c'}
  }

  // fonction lancée au clic sur le picto coeur
  const likeMovie = () => {
    props.handleClickMovieFct(props.isLike, {title: props.movieName, img: props.movieImg});
  };

  // fonction lancée au clic sur le picto film, on incrémente countWatchMovie
  const addWatch = () => {
    setWatchMovie(true);
    setCountWatchMovie(countWatchMovie+1);
  };

  // fonction lancée au clic sur le picto +, on incrémente myRatingMovie max jusqu'à 10
  const addRatingMovie = () => {
    if (myRatingMovie<11) {
      setMyRatingMovie(myRatingMovie+1);
      setVoteBooleen(true);
    };
  };

  // fonction lancée au clic sur le picto +, on décrémente myRatingMovie max jusqu'à 0
  const removeRatingMovie = () => {
    if (myRatingMovie>0) {
      setMyRatingMovie(myRatingMovie-1);
      setVoteBooleen(true);
    };
  };

  // fonction lancée au clic sur une des étoiles on set directement la valeur retournée par i
  const starClick = (index) => {
    setVoteBooleen(true);
    setMyRatingMovie(index);
  };

  // si la variable d'état est à true (si on a voté) on incrémente le nombre de vote
  if(voteBooleen) {
    globalCountRating+=1;
  };

  // calcule de la moyenne
  // Etape 1 : Revenir au score total en multipliant la note initiale par le nombre de votes
  // 9,2 x 3 = 27,6
  // Etape 2 : Ajouter la nouvelle note (2 dans notre exemple)
  // 27,6 + 2 = 29,6
  // Etape 3 : Revenir à une moyenne en divisant par le nombre total de votes (en prenant en compte le nouveau vote) dont 4 au total.
  // 29,6  / (3 +1) = 7,4
  const newGlobalRating = Math.round((globalCountRating * props.globalRating + myRatingMovie)/globalCountRating);

  // on met la couleur sur les étoiles pour myRating et pour myRatingMovie
  let tabMyRating = [];
  let tabGlobalRating = [];

  
  for(let i=0;i<10;i++){
      let colorMyRating = {};
      let colorGlobalRating = {};

      if(i<myRatingMovie){
        colorMyRating = {color: '#f1c40f'};
      };

      if(i<newGlobalRating){
        colorGlobalRating = {color: '#f1c40f'};
      };

      // eslint-disable-next-line
      tabMyRating.push(<FontAwesomeIcon className="cursorPointer" key={i} style={colorMyRating} icon={faStar} onClick={()=>starClick(i+1)} /> );
      tabGlobalRating.push(<FontAwesomeIcon key={i} style={colorGlobalRating} icon={faStar} /> );
  };

  return (
    <Col xs="12" lg="6" xl="4">
    <Card style={{marginBottom:30}}>
    <CardImg top src={props.movieImg} alt={props.movieName} />
    <CardBody>
        <div>Like <FontAwesomeIcon style={styleCoeur} icon={faHeart} onClick={ () => likeMovie() } /></div>
        <div>Nombre de vues  <FontAwesomeIcon style={colorWatch} className="cursorPointer" icon={faVideo} onClick={ () => addWatch() } /> <Badge color="secondary">{countWatchMovie}</Badge></div>
        <div>Mon avis 
          {tabMyRating}
          <ButtonGroup size="sm">
              <Button color="secondary" onClick={ () => removeRatingMovie() }>-</Button>
              <Button color="secondary" onClick={ () => addRatingMovie() }>+</Button>
          </ButtonGroup>
          </div>
          <div>Moyenne
          {tabGlobalRating}
          ({globalCountRating})
        </div>
        <CardTitle className="mt-3" tag="p">{props.movieName}</CardTitle>
        <CardText>{props.movieDesc}</CardText>
    </CardBody>
    </Card>
    </Col>


  );
};

export default Movie;
