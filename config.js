var clockConfig = {
    host: 'ws://localhost:13900/',
    node: 'default',
    seconds: 150,
    tracks: [{
    	source: '30SecstoGo.mp3',
    	start: '30 seconds before stop'
    },{
    	source: 'End.mp3',
    	start: 'on stop'
    },{
    	source: 'Start.mp3',
        start: 'on start',
    }]
}