import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { 
  Container,
  Row,
  Button,
  Nav,
  NavItem,
  NavLink,
  Popover, PopoverHeader, PopoverBody,
  ListGroup, ListGroupItem
 } from 'reactstrap';
import Movie from './components/Movie';

function App() {

  // variable d'état pour afficher le compteur de like
  const [moviesCount, setMoviesCount ] = useState(0);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [moviesWishList, setMoviesWishList] = useState([]);
  const [dataMovies, setdataMovies] = useState([]);

  useEffect(() => {
    displayLastMovie();    
  }, []);

  const displayLastMovie = async () => {
    const rawResponse = await fetch('/new-movies');
    const response = await rawResponse.json();
    setdataMovies(response.movies);

    const rawResponseWish = await fetch('/wishlist-movie');
    const responseWish = await rawResponseWish.json();
    setMoviesWishList( responseWish.movieList );
    setMoviesCount( responseWish.movieList.length );
  }

  // fonction qui gère l'ajout et la suppression des films dans la wishlist
  // on récupère le booléen pour savoir si on supprime ou si on delete
  const handleClickMovie = async (bool, obj) => {
    if (!bool) {
      await fetch('/wishlist-movie', {
        method: 'POST',
        headers: {'Content-Type':'application/x-www-form-urlencoded'},
        body: `movieName=${obj.title}&img=${obj.img}`
      });

      setMoviesCount(moviesCount+1);
      setMoviesWishList( [...moviesWishList, obj] );
    } else {
      await fetch(`/wishlist-movie/${obj.title}`, {
        method: 'DELETE'
      });

      setMoviesCount(moviesCount-1);
      setMoviesWishList(moviesWishList.filter((element)=>(element.title !== obj.title)));
    }
  }

  // fonction qui supprime le film cliqué dans la wishlist
  const deleteMovieWish = (name) => {
    setMoviesWishList(moviesWishList.filter((element)=>(element.title !== name)));
    setMoviesCount(moviesCount-1);
  }

  // fonction pour ouvrir/fermer la whishlist
  const toggle = () => setPopoverOpen(!popoverOpen);

  const movieList = dataMovies.map((movie,i) => {
    // on initialise un variable booléenne
    let isLike = false;
    // on fait un find via le name sur le tableau moviesWishList pour voir si le film est dans la whishList
    const result = moviesWishList.find(e=>e.title === movie.title);
    // si le résultat n'est pas undefined, donc que le film y est, on passe isLike à true
    // puis on le passe en paramètre du composant enfant
    if (result !== undefined) {
      isLike=true;
    }

    let desc = movie.overview;
    if(desc.length > 80){
      desc = `${desc.substr(0, 80)}...`;
    }

    let urlImage = '/generique.jpg'
    if(movie.backdrop_path != null){
      urlImage = `https://image.tmdb.org/t/p/w500/${movie.backdrop_path}`;
    }

    return(<Movie key={i} isLike={isLike} movieName={movie.title} movieDesc={desc} movieImg={urlImage} globalRating={movie.vote_average} globalCountRating={movie.vote_count} handleClickMovieFct={handleClickMovie} />)
  });

  const ListGroupItemList = moviesWishList.map((listGroupItem,i) => {
    return(
      <ListGroupItem key={i} onClick={() => deleteMovieWish(listGroupItem.title)}>
        <img className="w-100" src={listGroupItem.img} alt={ listGroupItem.title } />
        { listGroupItem.title }
      </ListGroupItem>
    );
  });

  return (
    <div style={{backgroundColor:"#232528"}}>
      <Container>
        <Nav>
          <span className="navbar-brand">
            <img src="./logo.png" width="30" height="30" className="d-inline-block align-top" alt="logo" />
          </span>
          <NavItem>
            <NavLink style={{color:'white'}}>Last Releases</NavLink>
          </NavItem>
          <NavItem>
            <NavLink>
              <Button id="Popover1" type="button">{moviesCount} films</Button>
              <Popover placement="bottom" isOpen={popoverOpen} target="Popover1" toggle={toggle}>
                <PopoverHeader>Whishlist</PopoverHeader>
                <PopoverBody>
                  <ListGroup>
                    {ListGroupItemList}
                  </ListGroup>
                </PopoverBody>
              </Popover>
            </NavLink>
          </NavItem>
        </Nav>
        <Row>
          {movieList}
        </Row>
      </Container>
    </div>
  );
};

export default App;
