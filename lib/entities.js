module.exports.people = {
    hal: {
        embedded: {
            'people': {
                path: 'people',
                href: '/people/{item.id}',
                ignore: ['id', 'mother', 'father'],
                links: {
                    'father': '/people/{father}',
                    'mother': '/people/{mother}'
                }
            }
        }
    }
};

module.exports.person = {
    hal: {
        // ignore: ['id', 'mother', 'father'],
        links: {
            'father': '/people/{father}',
            'mother': '/people/{mother}'
        }
    }
};