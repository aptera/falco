module.exports = {
    show: () => {
        console.log(content);
    }
}

const content = 
"Falco: Sanitary pair and mob programming for the modern age        \r\n\
                                                                    \r\n\
start               Begin a mob programming session from            \r\n\
                    the current branch.                             \r\n\
                                                                    \r\n\
pass                Handoff the work in progress to the             \r\n\
                    git repo, so another driver can take over.      \r\n\
                                                                    \r\n\
drive               Pull down the work in progress from the         \r\n\
                    git repo to begin driving more changes.         \r\n\
                                                                    \r\n\
commit <message>    Commit and squash merge all changes from        \r\n\
                    the session back into the original working      \r\n\
                    branch. This ends the mobbing session.          \r\n\
                                                                    \r\n\
clean               When another driver commits the work from the   \r\n\
                    session, other drivers from the session can     \r\n\
                    run this to clean up the session locally.       \r\n\
                                                                    \r\n\
stop                Aborts the mobbing session and resets the       \r\n\
                    local environment.                              \r\n\
                                                                    \r\n\
";