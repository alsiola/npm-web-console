$(() => {
    const socket = io();
    
    socket.on('cmdOutput', cmdOutput => {
        const el =document.createElement('p');
        el.innerHTML = cmdOutput.cmd + " : " + cmdOutput.output;
        document.getElementById('output').appendChild(el);
    });

    $('#sendCommand').click(() => {
        socket.emit('command', $('#command').val());
    })
});

