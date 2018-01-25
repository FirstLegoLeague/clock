var clockConfig = {
    host: `ws://${window.location.hostname}:13900/`,
    node: 'default',
    seconds: 150,
    tracks: [{
        name: '30secs_left_track',
    	source: '30SecstoGo.mp3',
    	start: '120 seconds after start'
    },{
        name: 'end_track',
    	source: 'End.mp3',
    	start: 'on stop'
    },{
        name: 'start_track',
    	source: 'Start.mp3',
        start: 'on start',
    }]
};