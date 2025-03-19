<authors>{
    for $author in /bib/book/author
    group by $last := $author/last
    return <author last="{$last}"/>
}</authors>