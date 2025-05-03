const fs = require('fs');
const fetch = require('node-fetch');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const USERNAME = 'ganatan';

const query = `
{
  user(login: "${USERNAME}") {
    repositories(first: 100, ownerAffiliations: OWNER) {
      nodes {
        stargazerCount
        forkCount
      }
    }
  }
}
`;

fetch('https://api.github.com/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `bearer ${GITHUB_TOKEN}`
  },
  body: JSON.stringify({ query })
})
.then(res => res.json())
.then(data => {
  const repos = data.data.user.repositories.nodes;
  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazerCount, 0);
  const totalForks = repos.reduce((sum, repo) => sum + repo.forkCount, 0);
  
  const stats = `Total Stars: ${totalStars}\nTotal Forks: ${totalForks}`;
  fs.writeFileSync('STATS.md', stats);
})
.catch(err => console.error(err));
