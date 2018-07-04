    // Check if ServiceWorker supported
    if ('serviceWorker' in navigator) {

        var RESET_ON_NO_CLIENTS = true;

        navigator.serviceWorker.register('serviceworker.js')
            .then(function(reg) {

                // Here we add the event listener for receiving messages
                navigator.serviceWorker.addEventListener('message', function(event){
                    console.log("Main message - ", event);
                    render(event.data.state.count);
                });

                messageServiceWorker({ GET_STATE: true});

            }).catch(function(error) {
                console.error('Service Worker registration error : ', error);
            });

        // We fire an event on a tab/window dying
        // We can then check for killing all tabs/window
        if (RESET_ON_NO_CLIENTS) {
            window.onunload = function() {
                // postMessage should be synchronous in this context?
                navigator.serviceWorker.controller.postMessage({
                    TAB_KILLED: true
                });
            };
        }
    }
    // else { ... some gracefull fallback for no Service Worker support

     // Send generic messages to the Service Worker
     function messageServiceWorker(data){
        if (navigator.serviceWorker && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage(data);
        }
    }

    // Pass actions specifically to the Service Worker
    function actionToServiceWorker(action) {
        messageServiceWorker({ ACTION: action })
    }

    var increment = document.getElementById('increment');
    var decrement = document.getElementById('decrement');
    var incrementIfOdd = document.getElementById('incrementIfOdd');
    var reset = document.getElementById('reset');
    var value = document.getElementById("value");

    function render(newValue) {
        value.innerHTML = newValue;
    }

    // Events for buttons

    increment.addEventListener('click', function () {
        actionToServiceWorker('INCREMENT');
    });


    decrement.addEventListener('click', function () {
        actionToServiceWorker('DECREMENT');
        messageServiceWorker({ IS_ACTION: true, ACTION: 'DECREMENT'});
    });

    reset.addEventListener('click', function () {
        setTimeout(function () {
            actionToServiceWorker('RESET');
        }, 1000)
    });
