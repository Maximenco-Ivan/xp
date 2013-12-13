<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Enonic &middot; CMS</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">

    <link href="css/bootstrap.css" rel="stylesheet">
    <link href="css/main.css" rel="stylesheet">

    <link href="css/bootstrap-responsive.css" rel="stylesheet">
    <%
        if ("true".equals(request.getParameter("edit"))) {
    %>
    <link id="live-edit-css" rel="stylesheet" href="../../admin/live-edit/styles/_all.css" type="text/css"/>
    <%
        }
    %>
</head>

<body data-live-edit-type="page" data-live-edit-key="/path/to/this/page" data-live-edit-name="Jumping Jack - Frogger">
<%
    if ("true".equals(request.getParameter("edit"))) {
%>
<div class="live-edit-loader-splash-container">
    <div class="live-edit-loader-splash-content">
        <div class="live-edit-loader-splash-spinner live-edit-font-icon-spinner"></div>
        <div>loading page...</div>
    </div>
</div>
<%
    }
%>

<script src="js/jquery.js"></script>

<div class="container">

<div class="masthead">

    <h3 class="muted">Bluman Trampoliner</h3>

    <div class="navbar">
        <div class="navbar-inner">
            <div class="container">
                <ul class="nav">
                    <li><a href="#">Forside</a></li>
                    <li class="active"><a href="#">Trampoline</a></li>
                    <li><a href="#">Kjøpeguide</a></li>
                    <li><a href="#">Kundeservice</a></li>
                </ul>
            </div>
        </div>
    </div>
</div>

<div id="main" data-live-edit-type="region" data-live-edit-key="80" data-live-edit-name="Main">
<!-- Product show -->
<%@ include file="../../admin/live-edit/data/mock-component-10029.html" %>

<div class="row-fluid" data-live-edit-type="layout" data-live-edit-key="010101" data-live-edit-name="Layout 70-30">

<div class="span8" data-live-edit-type="region">
    <!-- Description -->
    <div data-live-edit-type="part" data-live-edit-key="10028" data-live-edit-name="Trampoline - Show Description">
        <h3>Beskrivelse</h3>
        <h4>Jumping Jack - Big Bounce</h4>

        <p>Trampoline av høyeste kvalitet laget for kommersielt bruk eller for den som vil ha det aller beste innen
            trampoliner. Trampolinen
            Berg Elite brukes blant annet av det tyske skilandslaget. Optimal brukervekt på trampolinen er 20-100
            kg.</p>


        <h4>Sprett</h4>

        <p>Trampolinen har galvaniserte fjær som er produsert i Europa og er spesiellt utviklet for å gi trampolinen
            optimal sprett.
            Hoppefølelsen på trampolinen er meget bra med en dyp og herlig sprett uten at det går ut over spensten.</p>

        <h4>Kvalitet og sikkerhet</h4>

        <p>Alle deler på trampolinen (bortsett fra hoppeduken) er håndlaget og testet i Nederland. Trampolinens ramme er
            dobbelt galvanisert og
            holder ekstremt høy kvalitet, noe som gjør trampolinen svært stille når den er i bruk. Trampolinens
            kantbeskyttelse er den beste på
            markedet. Sammen med en meget kontrollert sprett gir det den sikreste trampolinen i klassen. 10 års garanti
            på rammen og 5 års
            garanti på alle øvrige deler av trampolinen snakker for seg selv.</p>

    </div>

    <!-- Gallery -->
    <div id="myCarousel" class="carousel slide" data-live-edit-type="part" data-live-edit-key="10030"
         data-live-edit-name="Trampoline - Image Gallery">
        <div class="carousel-inner">
            <div class="item active">
                <img src="img/Elite_01.jpg" alt="">
            </div>
            <div class="item">
                <img src="img/Elite_02.jpg" alt="">
            </div>
            <div class="item">
                <img src="img/Elite_03.jpg" alt="">
            </div>
            <div class="item">
                <img src="img/Elite_05.jpg" alt="">
            </div>
        </div>
        <a class="left carousel-control" href="#myCarousel" data-slide="prev">&lsaquo;</a>
        <a class="right carousel-control" href="#myCarousel" data-slide="next">&rsaquo;</a>
        <script>
            !function ($) {
                $(function () {
                    // carousel demo
                    $('#myCarousel').carousel()
                })
            }(window.jQuery)
        </script>
    </div>


    <!-- Comments -->
    <div data-live-edit-type="part" data-live-edit-key="10026" data-live-edit-name="Trampoline - Comments">
        <h3>Kommentarer</h3>

        <div class="media">
            <a href="#" class="pull-left">
                <img src="img/anon.jpg" height="64px" width="64px"/>
            </a>

            <div class="media-body">
                <p>
                    Vi er svært godt fornøyd med vår trampoline fra Springfield Trampolines. Ungene har brukt den hele
                    sommeren og den er like
                    fin
                    også
                    sikkerhetsnettet. Kvaliteten er definitivt mye bedre enn billigvariantene man får kjøpt på
                    lekebutikker og hagesentre etc.
                    Vår
                    trampoline er dessuten helt klart den mest populære i nabolaget pga spensten Tilogmed mor og far har
                    forsøkt seg litt...
                    Veldig
                    bra
                    trim Det var enkelt å bestille på nettet og helt supert å få den levert på døra. Monteringen gikk
                    også veldig greit. Jeg
                    anbefaler
                    absolutt alle andre å legge litt ekstra penger i en kvalitetstrampoline fra Springfield Trampolines
                </p>

                <h5>Thomas Enonicsen</h5>

            </div>
            <hr/>
        </div>
        <div class="media">
            <a href="#" class="pull-left">
                <img src="img/anon.jpg" height="64px" width="64px"/>
            </a>

            <div class="media-body">

                <p>
                    En veldig bra trampoline Den er solid. Videoen der dere sammenligner denne og en billig modell er
                    riktig. Mange har spurt
                    hvorfor
                    jeg ville betale så mye for en trampline når det er mulig å få den billig. De fleste skjønner
                    hvorfor når de ser den og
                    prøver
                    den.
                </p>

                <h5>Thomas Sigdestad</h5>

            </div>
            <hr/>
        </div>
        <div class="media">
            <a href="#" class="pull-left">
                <img src="img/anon.jpg" height="64px" width="64px"/>
            </a>

            <div class="media-body">

                <p>
                    Vi er svært fornøyd med vår trampoline. Den er sikker man faller aldri mellom hoppematte og
                    sikkrehtsmatte selv når barn i
                    alle
                    andre løper rundt på kanten eller hopper aldri så skjevt eller mange. Sikkerhetsnettet har en
                    ypperlig løsning og er svært
                    komfortabelt å kræsje i. I det hele tatt veldig fornøyd og anbefaler tramploinene til alle som spør.
                </p>

                <h5>Thomas Lund</h5>

            </div>
            <hr/>
        </div>
        <div class="media">
            <a href="#" class="pull-left">
                <img src="img/anon.jpg" height="64px" width="64px"/>
            </a>

            <div class="media-body">

                <p>
                    Vi er veldig fornøyd med trampolina den er solid og god kvalitet. vi føler også at vi kan stole på
                    sikkerhetsnettet noe som
                    er
                    viktig for oss
                </p>

                <h5>Enonic Thomassen</h5>

            </div>
            <hr/>
        </div>
    </div>

</div>
<div class="span4" data-live-edit-type="region">
    <!-- Accessories -->
    <div data-live-edit-type="part" data-live-edit-key="10025" data-live-edit-name="Trampoline - Show Accessories">
        <h3>Tilbehør</h3>

        <div class="media" data-live-edit-type="content" data-live-edit-name="Accessories - Ladder">
            <a href="#" class="pull-left">
                <img src="img/Prod_liten_tillbehor_stege.png" height="64px" width="99px"/>
            </a>

            <div class="media-body">
                <h4>Stige</h4>

                <p>Pris<br/>
                    100,-
                </p>

            </div>
            <hr/>
        </div>
        <div class="media" data-live-edit-type="content" data-live-edit-name="Accessories - Lower safety net">
            <a href="#" class="pull-left">
                <img src="img/Prod_liten_tillbehor_nedre-skyddsnat_1.png" height="64px" width="99px"/>
            </a>

            <div class="media-body">
                <h4>Rammenett</h4>

                <p>Pris<br/>
                    539,-
                </p>

            </div>
            <hr/>
        </div>
        <div class="media" data-live-edit-type="content" data-live-edit-name="Accessories - Cover">
            <a href="#" class="pull-left">
                <img src="img/Prod_liten_tillbehor_overdragsskydd_basic.png" height="64px" width="99px"/>
            </a>

            <div class="media-body">
                <h4>Overtrekk</h4>

                <p>Pris<br/>
                    349,-
                </p>

            </div>
            <hr/>
        </div>
        <div class="media" data-live-edit-type="content" data-live-edit-name="Accessories - Safety net">
            <a href="#" class="pull-left">
                <img src="img/Prod_liten_Champion-med-nat.png" height="64px" width="99px"/>
            </a>

            <div class="media-body">
                <h4>Sikkerhetsnett</h4>

                <p>Pris<br/>
                    1799,-
                </p>

            </div>
            <hr/>
        </div>
    </div>
</div>
</div>


</div>
<hr>

<div class="footer">
    <small class="pull-right">Demo site made by Enonic 2013</small>
</div>

</div>


<script src="js/bootstrap.js"></script>

<%
    if ("true".equals(request.getParameter("edit"))) {
%>

<script type="text/javascript">
    var CONFIG = {
        baseUri: 'http://localhost:8080'
    };
</script>

<!-- Libs -->
<script type="text/javascript" src="../../admin/common/lib/_all.js"></script>
<script type="text/javascript" charset="UTF-8" src="../../admin/live-edit/lib/jquery.ui.touch-punch.min.js"></script>
<script type="text/javascript" charset="UTF-8" src="../../admin/live-edit/lib/jquery.ba-resize.min.js"></script>

<!-- It is important that this is loaded right after all jQuery dependencies -->
<script type="text/javascript" charset="UTF-8" src="../../admin/live-edit/lib/jquery.noconflict.js"></script>
<script type="text/javascript" charset="UTF-8" src="../../admin/live-edit/js/_all.js"></script>

<script type="text/javascript">
    $(function () {
        var componentType = new LiveEdit.component.ComponentType(LiveEdit.component.Type.IMAGE);
        componentType.setName("image");
        componentType.setIconCls("live-edit-font-icon-image");
        var component = new LiveEdit.component.Component();
        component.setComponentType(componentType);


        var emptyImageComponent = LiveEdit.component.dragdropsort.EmptyComponent.createEmptyComponentHtml(component);
        $("#main").prepend(emptyImageComponent.getHTMLElement());
        emptyImageComponent.init();
    });
</script>


<%
    }
%>


<%
    if (request.getParameter("edit") == null) {
%>
<div style="position: absolute; top: 10px; right: 10px;"><a
        href="../../admin/home.html#/cm/open/56bf6229-b5f8-4085-9bd2-58eb103e367b">Open</a></div>
<%
    }
%>


</body>
</html>
