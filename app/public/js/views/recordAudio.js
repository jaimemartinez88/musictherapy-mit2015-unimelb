

var recordAudio, recordVideo;
$startRecording.onclick = function() {
	console.log('click on start recording '+username)
	$startRecording.disabled = true
	$stopRecordingAudio.disabled = false;
	$mixRecordings.disabled = true;
	socket.emit('start recording');
	$startRecording.style.display='none';
	$stopRecordingAudio.style.display='block';
};


$stopRecordingAudio.onclick = function() {
	$startRecording.disabled = false;
	$startRecording.style.display='none';
	$stopRecordingAudio.disabled = true;
	$mixRecordings.disabled = false;
	socket.emit('stop recording');
	$stopRecordingAudio.style.display='none';
	$mixRecordings.style.display='block';
};
$mixRecordings.onclick = function() {
	$startRecording.disabled = false;
	$mixRecordings.style.display='none';
	$startRecording.style.display='block';
	$stopRecordingAudio.disabled = true;
	$mixRecordings.disabled = true;
	var d = new Date()
  var fileName = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+"_"+"SessionX"+"_RecordingY";
  var mixedFileName = prompt("File name: ", fileName);
	socket.emit('mix recordings',mixedFileName);
};
function toggleRemoteAudio(){
	for (var key in connectedUsers) {
		console.log(key);
		if(key.includes("Clinician")){
			continue;
		}
		var curRemoteVideo = $($("#panels"+key)).find("#remoteVideo");
		console.log(curRemoteVideo);
		$(curRemoteVideo).prop("muted",!$(curRemoteVideo).prop("muted"));
	}
}

//when start recording is received, then record local stream
socket.on('start recording',function (){
	console.log("recording local audio")
	toggleRemoteAudio();
	mediaStream = stream = getLocalStream();
	recordAudio = RecordRTC(stream);
	recordAudio.startRecording();
});

socket.on('stop recording',function (){
	console.log("stop recording local audio")
	toggleRemoteAudio();
	recordAudio.stopRecording(function() {
		// get audio data-URL
		recordAudio.getDataURL(function(audioDataURL) {
			var file = {
				audio: {
					type: recordAudio.getBlob().type || 'audio/wav',
					dataURL: audioDataURL,
					user : username,
					email : email
				}
			};
			socket.emit('myrecording',file )
		});
});
});
