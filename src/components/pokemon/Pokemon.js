import React, { Component } from 'react'
import axios from 'axios';


const TYPE_COLORS = {
    bug: 'C2D21F',
    dark: '8D6754',
    dragon: '8774FF',
    electric: 'FDE13A',
    fairy: 'F9AEFF',
    fighting: 'A85644',
    fire: 'FA5643',
    flying: '79A4FF',
    ghost: '7975D7',
    grass: '8DD852',
    ground: 'E7C655',
    ice: '96F1FF',
    normal: 'BCBCAE',
    poison: 'AA5DA1',
    psychic: 'F461B0',
    rock: 'CDBC72',
    steel: 'C4C2DB',
    water: '56AEFF',
};

export default class Pokemon extends Component {
    
    state = {
        name: '',
        pokemonIndex: '',
        imageUrl:'',
        types: [],
        description: '',
        stats: {
            hp:"",
            attack:"",
            defense:"",
            speed:"",
            specialAttack:"",
            specialDefense:""
        },
        height:"",
        weight:"",
        eggGroup:"",
        abilities:"",
        genderRatioMale:"",
        genderRatioFemale:"",
        evs:"",
        hatchSteps:""
    }
    
    
    async componentDidMount(){
        const {pokemonIndex} = this.props.match.params;

        // Urls for pokemon information
        const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonIndex}/`;
        const pokemonSpeciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonIndex}`;

        //Get Pokemon Information
        const pokemonRes = await axios.get(pokemonUrl);

        const name = pokemonRes.data.name;
        const imageUrl = pokemonRes.data.sprites.front_default;

        let{hp, attack, defense, speed, specialAttack, specialDefense} = '';

        pokemonRes.data.stats.map(stat => {
        switch(stat.stat.name){

                case 'hp':
                hp= stat['base_stat'];
                break;

                case 'attack':
                attack= stat['base_stat'];
                 break;       
                    
                case 'defense':
                defense= stat['base_stat'];    
                break;                
                        
                case 'speed':        
                speed= stat['base_stat'];
                break;

                case 'special-attack':
                specialAttack= stat['base_stat'];
                break;

                case 'special-defense':
                specialDefense= stat['base_stat'];
                break;

        }
        }
        );

        //Pokemon height in Decimeters to Feet... The ( 0.0001 * 100)/ 100 is for rounding to Decimal places
        const height = Math.round((pokemonRes.data.height * 0.328084 + 0.0001) * 100)/100;
        
        //convert hactograms to pounds
        const weight = Math.round((pokemonRes.data.weight * 0.220462 + 0.0001)* 100)/100;

        const types = pokemonRes.data.types.map(type => type.type.name);

        const abilities = pokemonRes.data.abilities.map(ability => {
            return ability.ability.name.toLowerCase()
            .split('-')
            .map(s => s.charAt(0).toUpperCase()+s.substring(1))
            .join(" ")
        });

        const evs = pokemonRes.data.stats.filter(stat => {
            if(stat.effort > 0){
                return true;
            }
            return false;
        })
        .map(stat => {
            return `${stat.effort} ${stat.stat.name.toLowerCase()
            .split('-')
            .map(s => s.charAt(0).toUpperCase()+s.substring(1))
            .join(" ") }`

        }).join(', ');

        //Get Pokemon Description, Catch Rate, EggGroups, Gender Ratio, hatch Steps

        await axios.get(pokemonSpeciesUrl).then(res => {
            let description = '';
            res.data.flavor_text_entries.some(flavor => {
                if(flavor.language.name === 'en'){
                    description = flavor.flavor_text;
                    return;
                }
            });

            const femaleRate = res.data['gender_rate'];
            const genderRatioFemale = 12.5 * femaleRate;
            const genderRatioMale = 12.5 * (8 - femaleRate);

            const catchRate = Math.round((100/255) * res.data['capture_rate']);

            const eggGroups = res.data['egg_groups'].map(group => {
                return group.name.toLowerCase()
                .split('-')
                .map(s => s.charAt(0).toUpperCase()+s.substring(1))
                .join(" ");
            }).join(', ');

            const hatchSteps = 255 * (res.data['hatch_counter'] + 1 );

            this.setState({
                description,
                genderRatioFemale,
                genderRatioMale,
                catchRate,
                eggGroups,
                hatchSteps


            });
        });
    

        this.setState({
            imageUrl,
            pokemonIndex,
            name,
            types,
            stats: {
                hp,
                attack,
                defense,
                speed,
                specialAttack,
                specialDefense
            },
            height,
            weight,
            abilities,
            evs

        });
    }

    render() {
        return (
            <div >
                <h1 className='text-capitalize'>{this.state.name}</h1>
                <div className='col'>
                    <div className='card'>
                        <div className='card-header'>
                            <div className='row'>
                               <div className='col-md-5'>
                                   <h5>{this.state.pokemonIndex}</h5>
                        </div>
                        <div className='col-md-7'>
                        <div className='float-right'>
                            {this.state.types.map(type => (
                                <span key={type}
                            className='badge badge-primary badge-pill mr-1 text-capitalize'
                            style={{backgroundColor: `#${TYPE_COLORS[type]}`, 
                            color: 'white'
                        }}
                            >{type}</span>
                            ) )}
                        </div>

                        </div>
                     </div>
                        </div>
                    <div className='card-body'>
                        <div className='row align-items-center'>
                            <div className='col-md-3'>
                                <img src={this.state.imageUrl} className='card-img-top rounded mx-auto mt-2'   ></img>
                            </div>
                            <div className='col-md-9'>
                                <h4 className='mx-auto text-capitalize'>
                                    {this.state.name}
                                </h4>
                                
                              <div className='row align-items-center'>
                                    <div className='col-12 col-md-3'>
                                    HP</div>
                                    <div className='col-12 col-md-9'>
                                        <div className='progress'>
                                            <div className='progress-bar'
                                            role='progressBar' style={{
                                                width: `${this.state.stats.hp}%`
                                            }}
                                            aria-valuenow='25'
                                            aria-valuemin='0'
                                            aria-valuemax='100'>
                                                <small>{this.state.stats.hp}</small>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>

                              <div className='row align-items-center'>
                                    <div className='col-12 col-md-3'>
                                    Attack</div>
                                    <div className='col-12 col-md-9'>
                                        <div className='progress'>
                                            <div className='progress-bar'
                                            role='progressBar' style={{
                                                width: `${this.state.stats.attack}%`
                                            }}
                                            aria-valuenow='25'
                                            aria-valuemin='0'
                                            aria-valuemax='100'>
                                                <small>{this.state.stats.attack}</small>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>

                          <div className='row align-items-center'>
                                    <div className='col-12 col-md-3'>
                                    Defense</div>
                                    <div className='col-12 col-md-9'>
                                        <div className='progress'>
                                            <div className='progress-bar'
                                            role='progressBar' style={{
                                                width: `${this.state.stats.defense}%`
                                            }}
                                            aria-valuenow='25'
                                            aria-valuemin='0'
                                            aria-valuemax='100'>
                                                <small>{this.state.stats.defense}</small>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>

                               <div className='row align-items-center'>
                                    <div className='col-12 col-md-3'>
                                    Speed</div>
                                    <div className='col-12 col-md-9'>
                                        <div className='progress'>
                                            <div className='progress-bar'
                                            role='progressBar' style={{
                                                width: `${this.state.stats.speed}%`
                                            }}
                                            aria-valuenow='25'
                                            aria-valuemin='0'
                                            aria-valuemax='100'>
                                                <small>{this.state.stats.speed}</small>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>

                               <div className='row align-items-center'>
                                    <div className='col-12 col-md-3'>
                                    Special Attack</div>
                                    <div className='col-12 col-md-9'>
                                        <div className='progress'>
                                            <div className='progress-bar'
                                            role='progressBar' style={{
                                                width: `${this.state.stats.specialAttack}%`
                                            }}
                                            aria-valuenow='25'
                                            aria-valuemin='0'
                                            aria-valuemax='100'>
                                                <small>{this.state.stats.specialAttack}</small>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>

                               <div className='row align-items-center'>
                                    <div className='col-12 col-md-3'>
                                    Special Defense</div>
                                    <div className='col-12 col-md-9'>
                                        <div className='progress'>
                                            <div className='progress-bar'
                                            role='progressBar' style={{
                                                width: `${this.state.stats.specialDefense}%`
                                            }}
                                            aria-valuenow='25'
                                            aria-valuemin='0'
                                            aria-valuemax='100'>
                                                <small>{this.state.stats.specialDefense}</small>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>

                                


                            </div>
                        </div>

                        <div className='row mt-1'>
                            <div className='col'>
                                        <p className='p-2 mr-2'>{this.state.description}</p>
                            </div>
                        </div>
                       

                    </div>
                      
                       <hr></hr>
                      <div className='card-body'>
                        <h5 className='card-title text-center'>
                          Profile          
                        </h5>
                        <div className='row'>
                             <div className='col-md-6 float-left'>
                                 <div className='row'>
                                    <div className='col-md-6'>
                                        <h6 className='float-left'>Height:</h6>
                                    </div>
                                    <div className='col-md-6'>
                                        <p className='float-left'>{this.state.height} ft</p> 
                                    </div>
                                 </div>
                                 <div className='row'>
                                    <div className='col-md-6'>
                                        <h6 className='float-left'>Weight:</h6>
                                    </div>
                                    <div className='col-md-6'>
                                        <p className='float-left'>{this.state.weight} lbs</p> 
                                    </div>
                                 </div>
                                 <div className='row'>
                                    <div className='col-md-6'>
                                        <h6 className='float-left'>Catch Rate:</h6>
                                    </div>
                                    <div className='col-md-6'>
                                        <p className='float-left'>{this.state.catchRate} %</p> 
                                    </div>
                                 </div>
                                 <div className='row'>
                                    <div className='col-md-6'>
                                        <h6 className='float-left'>Gender Ratio:</h6>
                                    </div>
                                    <div className='col-md-6'>
                                        <div className='progress'>
                                            <div className='progress-bar'
                                                 role='progressbar'
                                                style={{
                                                    width: `${this.state.genderRatioFemale}%`,
                                                    backgroundColor: "#C2185B"

                                                }}
                                                aria-valuenow='15'
                                                aria-valuemin='0'
                                                aria-valuemax='100'
                                            ><small> {this.state.genderRatioFemale} </small>

                                            </div>
                                            <div className='progress-bar'
                                            role='progressbar'
                                            style={{
                                                width: `${this.state.genderRatioMale}%`,
                                                backgroundColor: '#1976D2'
                                            }}
                                            aria-valuenow='30'
                                            aria-valuemin='0'
                                            aria-valuemax='100'

                                            ><small> {this.state.genderRatioMale} </small>

                                            </div>
                                        </div> 
                                    
                                            </div>
                                 </div>
                                 
                                 
                            </div>


                            <div className='col-md-6 float-right'>
                                <div className='row'>
                                    
                                        <div className='col-md-6'>
                                            <h6 className='float-left'>Egg Groups:</h6>
                                        </div>
                                        <div className='col-md-6'>
                                            <p className='float-left'>{this.state.eggGroups} </p> 
                                        </div>
                                    


                                </div>
                                <div className='row'>
                                    <div className='col-md-6'>
                                        <h6 className='float-left'>Hatch Steps:</h6>
                                    </div>
                                    <div className='col-md-6'>
                                        <p className='float-left'>{this.state.hatchSteps} steps</p> 
                                    </div>
                                 </div>
                                <div className='row'>
                                    <div className='col-md-6'>
                                        <h6 className='float-left'>Abilities:</h6>
                                    </div>
                                    <div className='col-md-6'>
                                        <p className='float-left'>{this.state.abilities}</p> 
                                    </div>
                                 </div>
                                 <div className='row'>
                                    <div className='col-md-6'>
                                        <h6 className='float-left'>EVs:</h6>
                                    </div>
                                    <div className='col-md-6'>
                                        <p className='float-left'>{this.state.evs} </p> 
                                    </div>
                                 </div>
                            
                            
                            </div>                   
                        </div>

                    </div>

                    <div className='card-footer text-muted text-capitalize'>
                        Dados recolhidos de <a href='https://pokeapi.co/' target='_blank' className='card-link'>PokeAPI.co</a>
                    </div>
                    </div>
                   
                   
                </div>
            </div>
        )
    }
}
