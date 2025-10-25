from django.db import models

class Project(models.Model):
    id_project = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=45)
    date_creation = models.DateField()

    def __str__(self):
        return self.nom

class Node(models.Model):
    id_node = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=45)
    level = models.IntegerField()
    id_project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='nodes')

    def __str__(self):
        return self.nom

class Priority(models.Model):
    node = models.ForeignKey(Node, on_delete=models.CASCADE, related_name='priorities')
    column_sum = models.DecimalField(max_digits=5, decimal_places=0)
    nrmal_row_sum = models.DecimalField(max_digits=5, decimal_places=0)
    parent_id = models.IntegerField()  # This could be a ForeignKey to Node if needed
    local_weight = models.DecimalField(max_digits=5, decimal_places=0)

    def __str__(self):
        return f"Priority for Node: {self.node.nom}"

class Rank(models.Model):
    id_node = models.OneToOneField(Node, on_delete=models.CASCADE, primary_key=True, related_name='rank')
    global_note = models.DecimalField(max_digits=5, decimal_places=0)
    rank = models.IntegerField()

    def __str__(self):
        return f"Rank: {self.rank} for Node: {self.id_node.nom}"

class Comparaison(models.Model):
    compared_to = models.ForeignKey(Node, on_delete=models.CASCADE, related_name='comparisons_to')
    id_node1 = models.ForeignKey(Node, on_delete=models.CASCADE, related_name='comparisons_node1')
    id_node2 = models.ForeignKey(Node, on_delete=models.CASCADE, related_name='comparisons_node2')
    value = models.DecimalField(max_digits=5, decimal_places=0)

    def __str__(self):
        return f"Comparison between {self.id_node1.nom} and {self.id_node2.nom} (Value: {self.value})"
