import React, {Fragment} from 'react'
import spinner from './spinner.gif'
//TODO: Add spinner gif to this directory!

export default () => ( 
    <Fragment>
        <img
            src={spinner}
            style={{width: '200px', margin: 'auto', display: 'block'}}
            alt='Loading...'
        />
    </Fragment>
 )