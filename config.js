var clockConfig = {
    host: 'ws://localhost:13900/',
    node: 'default',
    seconds: 150,
    tracks: [{
    	source: 'mp3/lossetrack-A +6.mp3',
    	start: '5s after start'
    },{
    	source: 'mp3/lossetrack-B.mp3',
    	start: 'on end'
    }]
}