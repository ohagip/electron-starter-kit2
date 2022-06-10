import config from '../config'
import Sample from '../classes/Sample'

const sample = new Sample('index')
console.log('config', config)
console.log(sample.getName())
