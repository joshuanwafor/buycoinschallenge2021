



// Receives @data : {[key: string]: value: string}
// Renders mini templateVars on the DOM using keys on data.
function renderBodyComponent(data) {
    let element = document.body;
    let innerHTML = element.innerHTML;
    for (const [key, value] of Object.entries(data)) {
        innerHTML = innerHTML.replace(`{${key}}`, value);
        // little hack to replace avartarUrl placeholder atleast 3 times on the DOM.
        innerHTML = innerHTML.replace(`{${key}}`, value);
    }
    // replace body with properly rendered HTML.
    element.innerHTML = innerHTML;
  }
  


// Receives @data : {[key: string]: value: string}
// Populates cloned dom element(GitHub cardRepo template) with template vars and inserts in repo list container 
function renderRepoComponent(data) {
    let element = document.getElementById("repo-tag");
    let clone = element.cloneNode(true);
    let repoList = document.getElementById("repo-list");

    let innerHTML = element.innerHTML;

    for (const [key, value] of Object.entries(data)) {
        console.log(key)
        console.log(value)
        innerHTML = innerHTML.replace(`{${key}}`, value??"Empty string");
    }

    clone.innerHTML = innerHTML;
    repoList.insertAdjacentElement("afterend", clone)
}


//Retrieves user's data from github graphapi
async function getUserData(username) {
    const graphURL = "https://api.github.com/graphql";
    const query = JSON.stringify({
        query: `
        {
            search(type: USER, query: "${username}", first: 1) {
              nodes {
                ... on User {
                  id
                  email
                  bio
                  avatarUrl
                  name
                  twitterUsername
                  repositories(first: 20) {
                    nodes {
                      createdAt
                      updatedAt
                      name
                      description
                      stargazerCount
                      forkCount
                      languages(first: 1) {
                        nodes {
                          name
                          color
                        }
                      }
                      forkCount
                    }
                  }
                }
              }
            }
          }          
        `,
    })

    let response = await fetch(graphURL, {
        method: "POST",
        headers: {
            "Authorization": "bearer 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",
        },
        body: query
    })

    return await response.json()
}


async function renderUserData(user) {
  // query github for user data
  let result = await getUserData(user);
  let userNodes = result.data.search.nodes;
  // ensure user exists
  if (userNodes.length == 1) {
      // get user data
      let {
          id,email,bio,
          avatarUrl, name,twitterUsername,
      } = userNodes[0]

      // retrieve repo from node
      let repositories= userNodes[0].repositories.nodes;
      console.log(repositories)
      // add repos to list 
      Array.from(repositories).forEach((data)=>{

          let repo= data;

          if(data.languages.nodes.length>=1){
              let language= data.languages.nodes[0]['name'];
              repo.language= language;
          }else{
              repo.language="Not specified"
          }

          repo.updatedAt= new Date(repo.updatedAt).toLocaleDateString()
          renderRepoComponent(repo)
      })

      // render user data in body
      renderBodyComponent({
        id,email,bio,
        avatarUrl, name,twitterUsername,
    })
      
  }


  // flush template
  let repoTemp = document.getElementById("repo-tag");
  repoTemp.remove()
}