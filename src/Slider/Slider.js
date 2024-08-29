import React from 'react';
import './Slider.css';
import { uniqueId } from 'lodash';

export default class Slider extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      cards: [],
      cardsToShow: 1,
      offset: 0,
    }
  }

  componentDidMount() {
    fetch('https://reqres.in/api/users')
    .then(response => response.json())
    .then(json => json.data)
    .then((data) => {
      this.setState({cards: data})
    })
    .catch(error => console.error(error))
  }

  renderItems = () => {
    const { cards } = this.state
    return(
      cards.map((card) => {
        return (
          <div 
            key={uniqueId()}
            id={card.id}
            className="card"
            onClick={this.removeItem(card.id)}
          >
            <div className='card__img-cont'>
              <img className='card__img' src={card.avatar} alt='img'/>
            </div>
            <div className='card-content'>
              <h1 className='card-content__first-name'>{card.first_name}</h1>
              <h1 className='card-content__last-name'>{card.last_name}</h1>
              <a className='card-content__last-email' href="a">{card.email}</a>
            </div>
          </div>
        )
      })
    )
  }

  removeItem = (id) => (e) => {
    const { cards, cardsToShow } = this.state
    e.preventDefault();
    if(cardsToShow > 1) {
      const newCards = cards.filter((card) => card.id !== id);
      this.setState({ cards: newCards });
    } return
  };

  setCardsToShow = (e) => {
    this.setState({cardsToShow: Number(e.target.value)})
  }

  nextSlide = (e) => {
    const { offset, cards, cardsToShow } = this.state
    e.preventDefault()
    const maxOffset = -(180 * (cards.length - cardsToShow))
    this.setState({offset: Math.max(offset - (180 * cardsToShow), maxOffset)})
  }

  prevSlide = (e) => {
    const { cardsToShow, offset } = this.state
    e.preventDefault()
    this.setState({offset: Math.min(offset + (180 * cardsToShow), 0)})
  }

  render() {
    const { cardsToShow, offset } = this.state
    return (
      <div className='container'>
        <div className='selector'>
          <label>Select number of cards to show: </label>
          <select value={cardsToShow} onChange={this.setCardsToShow}>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
          </select>
        </div>
        <div className='slider' style={{width: `${270 * cardsToShow}px`}}>
        <button className='button' onClick={this.prevSlide}>Prev</button>
        <div className='window' style={{width: `${180 * cardsToShow}px`}}>
          <div className="all-cards-container" style={{ transform: `translateX(${offset}px)` }}>
            {this.renderItems()}
          </div>
        </div>
        <button className='button' onClick={this.nextSlide}>Next</button>
      </div>
      </div>
    )
  } 
}