<twoAuthors>{
    for $book in /bib/book[count(author) >= 2]
    return <title>
      {$book/title/text()}
      {
        for $author in $book/author
        return (<last>{$author/last/text()}</last>, <first>{$author/first/text()}</first>)
      }
    </title>
}</twoAuthors>