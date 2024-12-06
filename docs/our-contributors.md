# Our Contributors

We want to extend our heartfelt gratitude to the contributors who have made `@mindfiredigital/TextIgniterJS` possible.

<!-- truncate -->

## Contributors List

import React from 'react';

export default function Contributors() {
const contributorsData = {
'lakin-mohapatra': {
name: 'Lakin Mohapatra',
title: 'Tech Lead @ Mindfire Solutions',
url: 'https://github.com/lakinmindfire',
image_url: 'https://github.com/lakinmindfire.png',
},
'deepak-yadav': {
name: 'Deepak Yadav',
title: 'Software Engineer @ Mindfire Solutions',
url: 'https://github.com/deepakyadav-01',
image_url: 'https://github.com/deepakyadav-01.png',
},
'subhendu-swain': {
name: 'Subhendu Swain',
title: 'Senior Software Engineer @ Mindfire Solutions',
url: 'https://github.com/SubhenduS1999',
image_url: 'https://github.com/SubhenduS1999.png',
},
'jagdish-pal': {
name: 'Jagdish Pal',
title: 'Senior Software Engineer @ Mindfire Solutions',
url: 'https://github.com/jagdish-mindfire',
image_url: 'https://github.com/jagdish-mindfire.png',
},
};

return (
<div>
<h1>Our Contributors</h1>
<div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
{Object.entries(contributorsData).map(([key, contributor]) => (
<div key={key} style={{ display: 'flex', alignItems: 'center' }}>
<img
src={contributor.image_url}
alt={contributor.name}
style={{ borderRadius: '50%', width: '60px', height: '60px', marginRight: '20px' }}
/>
<div>
<h3>{contributor.name}</h3>
<p>{contributor.title}</p>
<a href={contributor.url} target="_blank" rel="noopener noreferrer">
GitHub Profile
</a>
</div>
</div>
))}
</div>
</div>
);
}
