let $books := /bib/book

for $publisher in distinct-values($books/publisher)
let $pubBooks := $books[publisher = $publisher]
order by $publisher
return
    <publisher>{$publisher}{
        for $book in $pubBooks
        return <title>{string($book/title)}</title>
    }</publisher>