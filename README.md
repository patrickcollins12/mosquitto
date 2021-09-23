# mqtt+webproxy

// TODO:
// get it daemon ready. must have. DONE
// eliminate mosquitto references. DONE

// TODO - Nice to have.
// QOS 2 not working... web request is finishing and killing the thread before CONNACK is received. qos1 is fine for our needs
// no error handling on publish fail
// poor error handling on connect fail. e.g. timeouts just loop
// user/pass on web. 
// add https certificate. has ongoing maintenance attached.
